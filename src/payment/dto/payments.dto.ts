import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class PaymentsDto {
  @Field(() => ID)
  id?: string;

  @Field()
  currency: string;

  @Field()
  dispatcherAmount: number;

  @Field()
  dispatcherPaymentStatus: string;

  @Field()
  lastUpdateTime: Date;

  @Field({ nullable: true })
  paymentDateTime?: Date;

  @Field()
  paymentMethod: string;

  @Field()
  sellerAmount: number;

  @Field()
  sellerPaymentStatus: string;
}