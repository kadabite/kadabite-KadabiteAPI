import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class DeleteOrderItemInput {
  @Field(() => ID)
  @IsUUID()
  orderId: string;

  @Field(() => ID)
  @IsUUID()
  orderItemId: string;
}