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
    const userId = 'fafwdaf';
    return this.productService.create(createProductInput, userId);
  }

  @Mutation(() => ProductDto)
  updateProduct(@Args('updateProductInput') updateProductInput: UpdateProductInput) {
    const userId = '3afsaf';
    return this.productService.update(updateProductInput, userId);
  }

  @Mutation(() => ProductDto)
  deleteProduct(@Args('deleteProductInput') deleteProductInput: DeleteProductInput) {
    const userId = 'farbfea';
    return this.productService.delete(deleteProductInput.id, userId);
  }

  @Query(() => [ProductDto], { name: 'getAllProducts' })
  findAll() {
    const page = 2;
    const limit = 10;
    return this.productService.findAll(page, limit);
  }

  @Query(() => ProductDto, { name: 'getProduct' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.productService.findOne(id);
  }

  @Query(() => [ProductDto], { name: 'getAllProductsOfUsersByCategory' })
  findAllByCategory(@Args('categoryId', { type: () => ID }) categoryId: string) {
    const userId = 'ddsfg';
    const page = 3;
    const limit = 4;
    return this.productService.findAllByCategory(userId, categoryId, page, limit);
  }

  @Query(() => [ProductDto], { name: 'getUserProducts' })
  findUserProducts() {
    const userId = 'sdfafafw3242';
    return this.productService.findUserProducts(userId);
  }
}