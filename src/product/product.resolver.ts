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

  @Mutation(() => ProductDto)
  @UseGuards(AuthGuard)
  createProduct(
    @Args('name') name: string,
    @Args('description') description: string,
    @Args('price') price: number,
    @Args('currency') currency: string,
    @Args('categoryId') categoryId: string,
    @Context() context
  ) {
    const userId = context.req.user.sub;
    const createProductInput: CreateProductInput = { name, description, price, currency, categoryId };
    return this.productService.create(createProductInput, userId);
  }

  @Mutation(() => ProductDto)
  @UseGuards(AuthGuard)
  updateProduct(
    @Args('id') id: string,
    @Context() context,
    @Args('currency', { nullable: true }) currency?: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('name', { nullable: true }) name?: string,
    @Args('photo', { nullable: true }) photo?: string,
    @Args('price', { nullable: true }) price?: number,
  ) {
    const userId = context.req.user.sub;
    const updateProductInput: UpdateProductInput = { id, currency, description, name, photo, price };
    return this.productService.update(updateProductInput, userId);
  }

  @Mutation(() => ProductDto)
  @UseGuards(AuthGuard)
  deleteProduct(
    @Args('id', { type: () => ID }) id: string,
    @Context() context) {
    const userId = context.req.user.sub;
    return this.productService.delete(id, userId);
  }

  @Query(() => [ProductDto], { name: 'getAllProducts' })
  findAll(@Args('page', { type: () => Number, nullable: true }) page: number = 1, @Args('limit', { type: () => Number, nullable: true }) limit: number = 10) {
    return this.productService.findAll(page, limit);
  }

  @Query(() => ProductDto, { name: 'getProduct' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.productService.findOne(id);
  }

  @Query(() => [ProductDto], { name: 'getAllProductsOfUsersByCategory' })
  findAllByCategory(@Args('categoryId', { type: () => ID }) categoryId: string, @Args('page', { type: () => Number, nullable: true }) page: number = 1, @Args('limit', { type: () => Number, nullable: true }) limit: number = 10) {
    const userId = 'ddsfg';
    return this.productService.findAllByCategory(userId, categoryId, page, limit);
  }

  @Query(() => [ProductDto], { name: 'getUserProducts' })
  @UseGuards(AuthGuard)
  findUserProducts(@Context() context) {
    const userId = context.req.user.sub;
    return this.productService.findUserProducts(userId);
  }
}