import { Injectable, Logger } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { CategoryDocument } from '@/category/schemas/category.schema';
import { MessageDto } from '@/user/dto/message.dto';
import { CategoryNotFoundError, CategoryAlreadyExistsError } from '@/common/custom-errors/user/category-not-found.error';
import { CreateCategoryInput } from '@/category/dto/create-category.input';
import { CreateCategoriesInput } from '@/category/dto/create-categories.input';
import { InvalidInputError } from '@/common/custom-errors/user/invalid-credentials.error';
import { UnauthorizedError } from '@/common/custom-errors/auth/unauthorized.error';
import _ from 'lodash';


@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    @InjectModel('Category') private categoryModel: Model<CategoryDocument>,
    @InjectConnection() private readonly connection: Connection
  ) {}

  async create(createCategoryInput: CreateCategoryInput): Promise<MessageDto> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      let { name } = createCategoryInput;
      // Trim leading and ending whitespaces if any
      name = _.trim(name);
      const listCategories = ['Consumable Products', 'Non-Consumable Products'];

      // Define the category format regex
      const categoryFormat = /^([\w\s]+)\|[\w\s]+\|[\w\s]+$/;

      // Validate category format
      if (!categoryFormat.test(name)) {
        throw new InvalidInputError('Invalid category format');
      }

      // Execute the regex and check if the result is not null
      const match = categoryFormat.exec(name);
      if (match && match[1]) {
        const mainName = match[1];
        if (!listCategories.includes(mainName)) {
          throw new InvalidInputError('Invalid category name');
        }
      } else {
        throw new InvalidInputError('Invalid category format');
      }

      // Check if category already exists
      const existingCategory = await this.categoryModel.findOne({ name }).session(session);
      if (existingCategory) {
        throw new CategoryAlreadyExistsError('Category already exists');
      }

      // Create and save new category
      const category = new this.categoryModel({ name });
      const categoryData = await category.save({ session });

      await session.commitTransaction();
      const categoryDto = {
        id: categoryData._id.toString(),
        name: categoryData.name,
      };
      return { categoryData: categoryDto, statusCode: 201, ok: true };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Error creating category: ' + (error as Error).message);

      if (error instanceof CategoryAlreadyExistsError || error instanceof InvalidInputError || error instanceof UnauthorizedError) {
        return { message: error.message, statusCode: 400, ok: false };
      }

      return { message: 'An error occurred!', statusCode: 500, ok: false };
    } finally {
      session.endSession();
    }
  }

  async createMany(createCategoriesInput: CreateCategoriesInput): Promise<MessageDto> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const { name } = createCategoriesInput;

      if (!Array.isArray(name)) {
        throw new InvalidInputError('Name must be an array');
      }
      if (name.length === 0) {
        throw new InvalidInputError('Name cannot be empty');
      }

      const listCategories = ['Consumable Products', 'Non-Consumable Products'];
      const categoryFormat = /^([\w\s]+)\|[\w\s]+\|[\w\s]+$/;

      const createdCategories = [];

      for (let singleName of name) {
        // Remove whitespaces from start and end of the string if any
        singleName = _.trim(singleName);

        // Validate category format
        if (!categoryFormat.test(singleName)) {
          throw new InvalidInputError('Invalid category format');
        }

        // Validate input
        const match = categoryFormat.exec(singleName);
        if (match && match[1]) {
          const mainName = match[1];
          if (!listCategories.includes(mainName)) {
            throw new InvalidInputError('Invalid category name');
          }
        } else {
          throw new InvalidInputError('Invalid category format');
        }

        // Check if category already exists
        const existingCategory = await this.categoryModel.findOne({ name: singleName }).session(session);
        if (existingCategory) {
          throw new CategoryAlreadyExistsError('Category already exists');
        }

        // Create and save new category
        const category = new this.categoryModel({ name: singleName });
        await category.save({ session });
        createdCategories.push(category);
      }

      await session.commitTransaction();
      return { message: 'Many categories have been created successfully!', categoriesData: createdCategories, statusCode: 201, ok: true };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Error creating categories: ' + (error as Error).message);

      if (error instanceof CategoryAlreadyExistsError || error instanceof InvalidInputError || error instanceof UnauthorizedError) {
        return { message: error.message, statusCode: 400, ok: false };
      }

      return { message: 'An error occurred!', statusCode: 500, ok: false };
    } finally {
      session.endSession();
    }
  }

  async findAll(): Promise<MessageDto> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const categoriesData = await this.categoryModel.find().session(session).exec();
      if (!categoriesData || categoriesData.length === 0) {
        throw new CategoryNotFoundError('No categories found');
      }

      await session.commitTransaction();
      const categoriesDto = categoriesData.map(category => ({
        id: category._id.toString(),
        name: category.name,
      }));
      return { categoriesData: categoriesDto, statusCode: 200, ok: true };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Error fetching categories: ' + (error as Error).message);

      if (error instanceof CategoryNotFoundError) {
        return { message: error.message, statusCode: 404, ok: false };
      }

      return { message: 'An error occurred!', statusCode: 500, ok: false };
    } finally {
      session.endSession();
    }
  }

  async findOne(id: string): Promise<MessageDto> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const categoryData = await this.categoryModel.findById(id).session(session);
      if (!categoryData) {
        throw new CategoryNotFoundError('Category does not exist');
      }

      await session.commitTransaction();
      const categoryDto = {
        id: categoryData._id.toString(),
        name: categoryData.name,
      };
      return { categoryData: categoryDto, statusCode: 200, ok: true };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Error fetching category: ' + (error as Error).message);

      if (error instanceof CategoryNotFoundError) {
        return { message: error.message, statusCode: 404, ok: false };
      }

      return { message: 'An error occurred!', statusCode: 500, ok: false };
    } finally {
      session.endSession();
    }
  }

  async delete(id: string): Promise<MessageDto> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const category = await this.categoryModel.findByIdAndDelete(id).session(session);
      if (!category) {
        throw new CategoryNotFoundError('Category not found');
      }

      await session.commitTransaction();
      return { message: 'Category has been deleted successfully!', statusCode: 200, ok: true };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Error deleting category: ' + (error as Error).message);

      if (error instanceof CategoryNotFoundError || error instanceof UnauthorizedError) {
        return { message: error.message, statusCode: 404, ok: false };
      }

      return { message: 'An error occurred!', statusCode: 500, ok: false };
    } finally {
      session.endSession();
    }
  }
}
