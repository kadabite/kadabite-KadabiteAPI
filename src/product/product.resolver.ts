import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { CreateProductInput } from '@/product/dto/create-product.input';
import { UpdateProductInput } from '@/product/dto/update-product.input';
import { DeleteProductInput } from '@/product/dto/delete-product.input';

@Resolver(() => ProductDto)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation(() => ProductDto)
  createProduct(@Args('createProductInput') createProductInput: CreateProductInput) {
    return this.productService.create(createProductInput);
  }

  @Mutation(() => ProductDto)
  updateProduct(@Args('updateProductInput') updateProductInput: UpdateProductInput) {
    return this.productService.update(updateProductInput.id, updateProductInput);
  }

  @Mutation(() => ProductDto)
  deleteProduct(@Args('deleteProductInput') deleteProductInput: DeleteProductInput) {
    return this.productService.delete(deleteProductInput.id);
  }

  @Query(() => [ProductDto], { name: 'getAllProducts' })
  findAll() {
    return this.productService.findAll();
  }

  @Query(() => ProductDto, { name: 'getProduct' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.productService.findOne(id);
  }

  @Query(() => [ProductDto], { name: 'getAllProductsOfUsersByCategory' })
  findAllByCategory(@Args('categoryId', { type: () => ID }) categoryId: string) {
    return this.productService.findAllByCategory(categoryId);
  }

  @Query(() => [ProductDto], { name: 'getUserProducts' })
  findUserProducts() {
    return this.productService.findUserProducts();
  }
}