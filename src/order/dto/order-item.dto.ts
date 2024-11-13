import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class OrderItemDto {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  comments?: string;

  @Field(() => ID)
  productId: string;

  @Field({ nullable: true })
  quantity?: number;

  @Field({ nullable: true })
  ratings?: number;
}