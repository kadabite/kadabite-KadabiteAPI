import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ProductDto } from '@/product/dto/product.dto';

@ObjectType()
export class CategoryDto {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => [ProductDto], { nullable: true })
  products?: ProductDto[];
}