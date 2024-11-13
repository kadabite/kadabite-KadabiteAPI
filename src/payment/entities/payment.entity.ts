import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Order } from '@/order/entities/order.entity';

@ObjectType()
export class Payment {
  @Field(() => ID)
  id: string;

  @Field(() => Order)
  orderId: Order;

  @Field()
  paymentDateTime: Date;

  @Field()
  lastUpdateTime: Date;

  @Field()
  paymentMethod: string;

  @Field()
  currency: string;

  @Field()
  sellerAmount: number;

  @Field()
  dispatcherAmount: number;

  @Field()
  sellerPaymentStatus: string;

  @Field()
  dispatcherPaymentStatus: string;

  @Field()
  isDeleted: boolean;
}