import { Module, forwardRef } from '@nestjs/common';
import { ProductService } from '@/product/product.service';
import { ProductResolver } from '@/product/product.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '@/product/schemas/product.schema';
import { UserModule } from '@/user/user.module';
import { CategoryModule } from '@/category/category.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
  providers: [ProductResolver, ProductService],
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    forwardRef(() => UserModule),
    CategoryModule,
    AuthModule
  ],
  exports: [MongooseModule, ProductService, ProductResolver, MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
})
export class ProductModule {}
