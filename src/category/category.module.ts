import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryResolver } from './category.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas/category.schema';

@Module({
  providers: [CategoryResolver, CategoryService],
  imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])],
})
export class CategoryModule {}
