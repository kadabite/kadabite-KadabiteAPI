import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsInt, IsUUID } from 'class-validator';

@InputType()
export class CreatePaymentInput {
  @Field(() => ID)
  @IsUUID()
  orderId: string;

  @Field()
  @IsString()
  paymentMethod: string;

  @Field()
  @IsString()
  currency: string;

  @Field()
  @IsInt()
  sellerAmount: number;

  @Field()
  @IsInt()
  dispatcherAmount: number;
}