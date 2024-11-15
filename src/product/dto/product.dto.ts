import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class ProductDto {
  @Field(() => ID)
  id?: string;

  @Field()
  name: string;

  @Field()
  description?: string;

  @Field()
  price: number;

  @Field()
  currency: string;

  @Field(() => ID)
  categoryId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  photo?: string;
}