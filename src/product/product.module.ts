import { Module } from '@nestjs/common';
import { ProductService } from '@/product/product.service';
import { ProductResolver } from '@/product/product.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '@/product/schemas/product.schema';

@Module({
  providers: [ProductResolver, ProductService],
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  exports: [MongooseModule],
})
export class ProductModule {}
