import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { ProductDocument } from '@/product/schemas/product.schema';
import { CreateProductInput } from '@/product/dto/create-product.input';
import { UpdateProductInput } from '@/product/dto/update-product.input';
import { MessageDto } from '@/user/dto/message.dto';
import { UserNotFoundError } from '@/common/custom-errors/user/user-not-found.error';
import { UserDocument } from '@/user/schemas/user.schema';
import mongoose, { Model, Connection } from 'mongoose';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { CategoryNotFoundError } from '@/common/custom-errors/user/category-not-found.error';
import { ProductAlreadyExistsError } from '@/common/custom-errors/user/product-already-exists.error';
import { ProductNotFoundError } from '@/common/custom-errors/user/product-not-found.error';
import * as _ from 'lodash';
import { CategoryDocument } from '@/category/schemas/category.schema';



@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    @InjectModel('Product') private productModel: Model<ProductDocument>,
    @InjectModel('User') private userModel: Model<UserDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel('Category') private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createProductInput: CreateProductInput, userId: string): Promise<MessageDto> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      let { name, description, price, currency, categoryId } = createProductInput;
      // Trim whitespace from the input
      name = _.trim(name);
      description = _.trim(description);
      currency = _.trim(currency);

      // Get the category information, return error message if false
      const category = await this.categoryModel.findById(categoryId).session(session);
      if (!category) {
        throw new CategoryNotFoundError('The product category ID must be specified!');
      }

      // Check if product name already exists for the user
      const user = await this.userModel.findById(userId).populate<{ products: ProductDocument[] }>('products').session(session);
      if (!user) {
        throw new UserNotFoundError('User not found');
      }

      // Type guard to check if product is populated
      const isProductPopulated = (product: mongoose.Types.ObjectId | ProductDocument): product is ProductDocument => {
        return (product as ProductDocument).categoryId !== undefined;
      };

      if (user.products) {
        if (user.products.find((obj) => isProductPopulated(obj) && obj.name === name)) {
          throw new ProductAlreadyExistsError('Product name already exists');
        }
      }

      const productData = new this.productModel({ name, description, price, currency, categoryId: category._id, userId: user._id });
      await productData.save({ session }); // Save the product first

      user.products.push(productData.id);
      await user.save({ session });

      await session.commitTransaction();
      return { productData: { ...productData.toObject(), categoryId: productData.categoryId.toString() }, statusCode: 200, ok: true };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Error creating product: ' + (error as Error).message);

      if (error instanceof UserNotFoundError || error instanceof CategoryNotFoundError || error instanceof ProductAlreadyExistsError) {
        return { message: error.message, statusCode: 400, ok: false };
      }

      return { message: 'An error occurred!', statusCode: 500, ok: false };
    } finally {
      session.endSession();
    }
  }

  async findAll(page: number, limit: number): Promise<MessageDto> {
    const cacheKey = `products_page_${page}_limit_${limit}`;
    try {
      // Check if the data is in the cache
      const cache = await this.cacheManager.get(cacheKey);
      if (cache) {
        const parsedData = JSON.parse(cache as string);
        return { productsData: parsedData.products, pagination: parsedData.pagination, statusCode: 200, ok: true };
      }

      // Fetch total number of items
      const totalItems = await this.productModel.countDocuments().exec();

      // Fetch data from the database with pagination
      const productsData = await this.productModel
        .find()
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      if (!productsData || productsData.length === 0) {
        return { message: 'No product was found!', statusCode: 404, ok: false };
      }

      // Calculate pagination details
      const totalPages = Math.ceil(totalItems / limit);
      const pagination = {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      };

      // Save the data in the cache for 1 hour (3600 seconds)
      await this.cacheManager.set(cacheKey, JSON.stringify({ products: productsData, pagination }), { ttl: 3600 });

      const formattedProductsData = productsData.map(product => ({
        ...product.toObject(),
        categoryId: product.categoryId.toString(),
      }));

      return { productsData: formattedProductsData, pagination, statusCode: 200, ok: true };
    } catch (error) {
      this.logger.error('Error getting all products: ' + (error as Error).message);
      return { message: 'An error occurred!', statusCode: 500, ok: false };
    }
  }

  async findOne(id: string): Promise<MessageDto> {
    try {
      const productData = await this.productModel.findById(id).exec();
      if (!productData) {
        return { message: 'No product was found!', statusCode: 404, ok: false };
      }
      return { productData: { ...productData.toObject(), categoryId: productData.categoryId.toString() }, statusCode: 200, ok: true };
    } catch (error) {
      this.logger.error('Error getting product: ' + (error as Error).message);
      return { message: 'An error occurred!', statusCode: 500, ok: false };
    }
  
  }

  async findAllByCategory(userId: string, categoryId: string, page: number, limit: number): Promise<MessageDto> {
    const cacheKey = `user_${userId}_category_${categoryId}_page_${page}_limit_${limit}`;
    try {
      // Check if the data is in the cache
      const cache = await this.cacheManager.get(cacheKey);
      if (cache) {
        const parsedData = JSON.parse(cache as string);
        return { productsData: parsedData.products, pagination: parsedData.pagination, statusCode: 200, ok: true };
      }

      // Find user and populate products
      const user = await this.userModel.findById(userId).populate<{ products: ProductDocument[] }>('products').exec();
      if (!user) {
        throw new UserNotFoundError('User not found');
      }

      // Filter products by category
      const filteredProducts = user.products.filter(product => product.categoryId.toString() === categoryId);

      // Calculate pagination details
      const totalItems = filteredProducts.length;
      const totalPages = Math.ceil(totalItems / limit);
      const paginatedProducts = filteredProducts.slice((page - 1) * limit, page * limit);

      const pagination = {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      };

      // Save the data in the cache for 1 hour (3600 seconds)
      await this.cacheManager.set(cacheKey, JSON.stringify({ products: paginatedProducts, pagination }), { ttl: 3600 });

      const formattedPaginatedProducts = paginatedProducts.map(product => ({
        ...product.toObject(),
        categoryId: product.categoryId.toString(),
      }));
      return { productsData: formattedPaginatedProducts, pagination, statusCode: 200, ok: true };
    } catch (error) {
      this.logger.error('Error getting products: ' + (error as Error).message);
      return { message: 'An error occurred!', statusCode: 500, ok: false };
    }
  }

  async findUserProducts(userId: string): Promise<MessageDto> {
    try {
      // Find user and populate products
      const user = await this.userModel.findById(userId).populate<{ products: ProductDocument[]}>('products').exec();
      if (!user) {
        throw new UserNotFoundError('User not found');
      }
      const productsData = user.products.map(product => ({
        ...product.toObject(),
        categoryId: product.categoryId.toString(),
      }));
      return { productsData, statusCode: 200, ok: true };
    } catch (error) {
      this.logger.error('Error getting user products: ' + (error as Error).message);
      return { message: 'An error occurred!', statusCode: 500, ok: false };
    }
  }

  async update(updateProductInput: UpdateProductInput, userId: string): Promise<MessageDto> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      // Sanitize user's input
      const keys = Object.keys(updateProductInput);
      const newProduct = keys
        .reduce((obj, key) => {
          if (key === 'description' || key === 'photo' || key === 'name') {
            (obj as Record<string, any>)[key] = _.trim(updateProductInput[key]);
          } else {
            (obj as Record<string, any>)[key] = updateProductInput[key];
          }
          return obj;
        }, {} as Record<string, any>);

      // Get the user data
      const user = await this.userModel.findById(userId).populate<{ product: ProductDocument[] }>('products').session(session);
      if (!user) {
        throw new UserNotFoundError('User not found');
      }

      const index = user.products.map(item => item.toString()).indexOf(updateProductInput.id);
      if (index === -1) {
        throw new ProductNotFoundError('This product does not exist for this user!');
      }

      newProduct.updatedAt = new Date().toISOString();

      // Validate category
      const category = await this.categoryModel.findById(updateProductInput.categoryId).session(session);
      if (!category) {
        throw new CategoryNotFoundError('This category does not exist');
      }

      // Update the product
      const productData = await this.productModel.findByIdAndUpdate(updateProductInput.id, newProduct, { new: true }).session(session);
      if (!productData) {
        throw new ProductNotFoundError('Could not update product');
      }

      await session.commitTransaction();
      return { productData: { ...productData.toObject(), categoryId: productData.categoryId.toString() }, statusCode: 200, ok: true };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Error updating product: ' + (error as Error).message);

      if (error instanceof UserNotFoundError || error instanceof ProductNotFoundError || error instanceof CategoryNotFoundError) {
        return { message: error.message, statusCode: 400, ok: false };
      }

      return { message: 'An error occurred!', statusCode: 500, ok: false };
    } finally {
      session.endSession();
    }
  }

  async delete(productId: string, userId: string): Promise<MessageDto> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      // Find user and populate products
      const user = await this.userModel.findById(userId).populate('products').session(session);
      if (!user) {
        throw new UserNotFoundError('User not found');
      }

      // Check if the product exists for the user
      const index = user.products.map(item => item.toString()).indexOf(productId);
      if (index === -1) {
        throw new ProductNotFoundError('This product does not exist for this user');
      }

      // Remove product from user's products
      user.products.splice(index, 1);

      // Delete product document
      const product = await this.productModel.findByIdAndDelete(productId).session(session);
      if (!product) {
        throw new ProductNotFoundError('Could not delete product');
      }

      // Save user document
      await user.save({ session });

      await session.commitTransaction();
      return { message: 'Successfully deleted!', statusCode: 200, ok: true };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Error deleting product: ' + (error as Error).message);

      if (error instanceof UserNotFoundError || error instanceof ProductNotFoundError) {
        return { message: error.message, statusCode: 404, ok: false };
      }

      return { message: 'An error occurred!', statusCode: 500, ok: false };
    } finally {
      session.endSession();
    }
  }
}
