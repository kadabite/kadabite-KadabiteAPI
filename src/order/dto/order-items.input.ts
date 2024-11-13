import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsUUID, IsInt, IsOptional } from 'class-validator';

@InputType()
export class OrderItemsInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  comments?: string;

  @Field(() => ID)
  @IsUUID()
  productId: string;

  @Field()
  @IsInt()
  quantity: number;

  @Field({ nullable: true })
  @IsInt()
  @IsOptional()
  ratings?: number;
}