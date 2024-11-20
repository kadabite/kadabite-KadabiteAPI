import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CategoryService } from '@/category/category.service';
import { CategoryDto } from '@/category/dto/category.dto';
import { CreateCategoryInput } from '@/category/dto/create-category.input';
import { CreateCategoriesInput } from '@/category/dto/create-categories.input';
import { DeleteCategoryInput } from '@/category/dto/delete-category.input';
import { AuthGuard } from '@/auth/auth.guard';

@Resolver(() => CategoryDto)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation(() => CategoryDto, { description: 'Create a new category' })
  @UseGuards(AuthGuard)
  createCategory(@Args() createCategoryInput: CreateCategoryInput) {
    return this.categoryService.create(createCategoryInput);
  }

  @Mutation(() => [CategoryDto], { description: 'Create multiple categories' })
  @UseGuards(AuthGuard)
  createCategories(@Args() createCategoriesInput: CreateCategoriesInput) {
    return this.categoryService.createMany(createCategoriesInput);
  }

  @Mutation(() => CategoryDto, { description: 'Delete a category by ID' })
  @UseGuards(AuthGuard)
  deleteCategory(@Args() deleteCategoryInput: DeleteCategoryInput) {
    return this.categoryService.delete(deleteCategoryInput.id);
  }

  @Query(() => [CategoryDto], { name: 'categories', description: 'Get all categories' })
  findAll() {
    return this.categoryService.findAll();
  }

  @Query(() => CategoryDto, { name: 'category', description: 'Get a category by ID' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.categoryService.findOne(id);
  }
}