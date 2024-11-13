import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdatePaymentInput {
  @Field(() => ID)
  @IsUUID()
  paymentId: string;

  @Field()
  @IsString()
  status: string;
}