import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryDocument } from '@/category/schemas/category.schema';
import { CreateCategoryInput } from '@/category/dto/create-category.input';
import { CreateCategoriesInput } from '@/category/dto/create-categories.input';
import { FilterQuery, UpdateQuery } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(@InjectModel('Category') private categoryModel: Model<CategoryDocument>) {}

  create(createCategoryInput: CreateCategoryInput): Promise<CategoryDocument> {
    const createdCategory = new this.categoryModel(createCategoryInput);
    return createdCategory.save();
  }

  createMany(createCategoriesInput: CreateCategoriesInput): Promise<CategoryDocument[]> {
    const createdCategories = createCategoriesInput.name.map(name => new this.categoryModel({ name }));
    return this.categoryModel.insertMany(createdCategories);
  }

  findAll(): Promise<CategoryDocument[]> {
    return this.categoryModel.find().exec();
  }

  findOne(id: string): Promise<CategoryDocument> {
    return this.categoryModel.findById(id).exec();
  }

  async delete(id: string): Promise<CategoryDocument> {
    return this.categoryModel.findByIdAndDelete(id).exec();
  }
}
