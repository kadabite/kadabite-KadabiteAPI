import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { CreateProductInput } from '@/product/dto/create-product.input';
import { UpdateProductInput } from '@/product/dto/update-product.input';
import { AuthGuard } from '@/auth/auth.guard';

@Resolver(() => ProductDto)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation(() => ProductDto, { description: 'Create a new product' })
  @UseGuards(AuthGuard)
  createProduct(
    @Args() createProductInput: CreateProductInput,
    @Context() context
  ) {
    const userId = context.req.user.sub;
    return this.productService.create(createProductInput, userId);
  }

  @Mutation(() => ProductDto, { description: 'Update an existing product' })
  @UseGuards(AuthGuard)
  updateProduct(
    @Args() updateProductInput: UpdateProductInput,
    @Context() context
  ) {
    const userId = context.req.user.sub;
    return this.productService.update(updateProductInput, userId);
  }

  @Mutation(() => ProductDto, { description: 'Delete a product by ID' })
  @UseGuards(AuthGuard)
  deleteProduct(
    @Args('id', { type: () => ID }) id: string,
    @Context() context) {
    const userId = context.req.user.sub;
    return this.productService.delete(id, userId);
  }

  @Query(() => [ProductDto], { name: 'getAllProducts', description: 'Get all products with pagination' })
  findAll(@Args('page', { type: () => Number, nullable: true }) page: number = 1, @Args('limit', { type: () => Number, nullable: true }) limit: number = 10) {
    return this.productService.findAll(page, limit);
  }

  @Query(() => ProductDto, { name: 'getProduct', description: 'Get a product by ID' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.productService.findOne(id);
  }

  @Query(() => [ProductDto], { name: 'getAllProductsOfUsersByCategory', description: 'Get all products of a user by category with pagination' })
  findAllByCategory(@Args('categoryId', { type: () => ID }) categoryId: string, @Args('page', { type: () => Number, nullable: true }) page: number = 1, @Args('limit', { type: () => Number, nullable: true }) limit: number = 10) {
    const userId = 'ddsfg';
    return this.productService.findAllByCategory(userId, categoryId, page, limit);
  }

  @Query(() => [ProductDto], { name: 'getUserProducts', description: 'Get all products of the current user' })
  @UseGuards(AuthGuard)
  findUserProducts(@Context() context) {
    const userId = context.req.user.sub;
    return this.productService.findUserProducts(userId);
  }
}