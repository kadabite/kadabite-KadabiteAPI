import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class DeleteOrderInput {
  @Field(() => ID)
  @IsUUID()
  orderId: string;
}