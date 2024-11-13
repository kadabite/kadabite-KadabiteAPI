import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class PaymentDto {
  @Field(() => ID)
  id: string;

  @Field()
  currency: string;

  @Field()
  dispatcherAmount: number;

  @Field()
  dispatcherPaymentStatus: string;

  @Field(() => ID)
  orderId: string;

  @Field()
  paymentDateTime: Date;

  @Field({ nullable: true })
  paymentMethod?: string;

  @Field()
  paymentStatus: string;

  @Field()
  sellerAmount: number;

  @Field()
  sellerPaymentStatus: string;

  @Field()
  totalAmount: number;
}