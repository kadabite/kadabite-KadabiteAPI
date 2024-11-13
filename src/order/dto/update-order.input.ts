import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateOrderInput {
  @Field(() => ID)
  @IsUUID()
  orderId: string;

  @Field()
  @IsString()
  status: string;
}