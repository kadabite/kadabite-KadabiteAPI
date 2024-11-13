import { Module } from '@nestjs/common';
import { CategoryService } from '@/category/category.service';
import { CategoryResolver } from '@/category/category.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from '@/category/schemas/category.schema';

@Module({
  providers: [CategoryResolver, CategoryService],
  imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])],
  exports: [MongooseModule],
})
export class CategoryModule {}
