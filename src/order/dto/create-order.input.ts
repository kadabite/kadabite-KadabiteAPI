import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsUUID, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemsInput } from '@/order/dto/order-items.input';

@InputType()
export class CreateOrderInput {
  @Field(() => ID)
  @IsUUID()
  sellerId: string;

  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  dispatcherId?: string;

  @Field()
  @IsString()
  deliveryAddress: string;

  @Field(() => [OrderItemsInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemsInput)
  orderItems: OrderItemsInput[];
}