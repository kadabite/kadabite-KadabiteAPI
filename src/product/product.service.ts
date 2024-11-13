import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDocument } from '@/product/schemas/product.schema';
import { CreateProductInput } from '@/product/dto/create-product.input';
import { UpdateProductInput } from '@/product/dto/update-product.input';

@Injectable()
export class ProductService {
  constructor(@InjectModel('Product') private productModel: Model<ProductDocument>) {}

  create(createProductInput: CreateProductInput): Promise<ProductDocument> {
    const createdProduct = new this.productModel(createProductInput);
    return createdProduct.save();
  }

  findAll(): Promise<ProductDocument[]> {
    return this.productModel.find().exec();
  }

  findOne(id: string): Promise<ProductDocument> {
    return this.productModel.findById(id).exec();
  }

  findAllByCategory(categoryId: string): Promise<ProductDocument[]> {
    return this.productModel.find({ categoryId }).exec();
  }

  findUserProducts(): Promise<ProductDocument[]> {
    // Implement logic to find user products
    return this.productModel.find().exec();
  }

  update(id: string, updateProductInput: UpdateProductInput): Promise<ProductDocument> {
    return this.productModel.findByIdAndUpdate(id, updateProductInput, { new: true }).exec();
  }

  delete(id: string): Promise<ProductDocument> {
    return this.productModel.findByIdAndDelete(id).exec();
  }
}
