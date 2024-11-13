import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Category } from '@/category/entities/category.entity';
import { User } from '@/user/entities/user.entity';

@ObjectType()
export class Product {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  price: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  currency: string;

  @Field({ nullable: true })
  photo?: string;

  @Field()
  quantity: number;

  @Field(() => Category)
  categoryId: Category;

  @Field(() => User)
  userId: User;
}