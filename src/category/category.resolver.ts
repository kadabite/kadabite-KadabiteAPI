import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { CategoryService } from '@/category/category.service';
import { CategoryDto } from '@/category/dto/category.dto';
import { CreateCategoryInput } from '@/category/dto/create-category.input';
import { CreateCategoriesInput } from '@/category/dto/create-categories.input';
import { DeleteCategoryInput } from '@/category/dto/delete-category.input';

@Resolver(() => CategoryDto)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation(() => CategoryDto)
  createCategory(@Args('createCategoryInput') createCategoryInput: CreateCategoryInput) {
    return this.categoryService.create(createCategoryInput);
  }

  @Mutation(() => [CategoryDto])
  createCategories(@Args('createCategoriesInput') createCategoriesInput: CreateCategoriesInput) {
    return this.categoryService.createMany(createCategoriesInput);
  }

  @Mutation(() => CategoryDto)
  deleteCategory(@Args('deleteCategoryInput') deleteCategoryInput: DeleteCategoryInput) {
    return this.categoryService.delete(deleteCategoryInput.id);
  }

  @Query(() => [CategoryDto], { name: 'categories' })
  findAll() {
    return this.categoryService.findAll();
  }

  @Query(() => CategoryDto, { name: 'category' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.categoryService.findOne(id);
  }
}