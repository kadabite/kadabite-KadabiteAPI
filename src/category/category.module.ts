import { Module } from '@nestjs/common';
import { CategoryService } from '@/category/category.service';
import { CategoryResolver } from '@/category/category.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from '@/category/schemas/category.schema';
import { AuthModule } from '@/auth/auth.module';

@Module({
  providers: [CategoryResolver, CategoryService],
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    AuthModule,
  ],
  exports: [
    MongooseModule,
    CategoryService,
    CategoryResolver,
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
  ],
})
export class CategoryModule {}
