import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItem2Input } from '@/order/dto/order-item2.input';

@InputType()
export class UpdateOrderItemsInput {
  @Field(() => ID)
  @IsUUID()
  orderId: string;

  @Field(() => [OrderItem2Input])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItem2Input)
  orderItems: OrderItem2Input[];
}
