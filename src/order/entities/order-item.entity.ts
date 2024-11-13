import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Product } from '@/product/entities/product.entity';

@ObjectType()
export class OrderItem {
  @Field(() => ID)
  id: string;

  @Field(() => Product)
  productId: Product;

  @Field()
  quantity: number;

  @Field({ nullable: true })
  comments?: string;

  @Field({ nullable: true })
  ratings?: number;
}