import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '@/user/entities/user.entity';
import { Payment } from '@/payment/entities/payment.entity';
import { OrderItem } from '@/order/entities/order-item.entity';

@ObjectType()
export class Order {
  @Field(() => ID)
  id: string;

  @Field(() => User)
  sellerId: User;

  @Field(() => User)
  buyerId: User;

  @Field(() => User, { nullable: true })
  dispatcherId?: User;

  @Field()
  orderDateTime: Date;

  @Field({ nullable: true })
  timeOfDelivery?: Date;

  @Field()
  recievedByBuyer: boolean;

  @Field()
  deliveredByDispatcher: boolean;

  @Field()
  deliveryAddress: string;

  @Field()
  currency: string;

  @Field()
  totalAmount: number;

  @Field()
  status: string;

  @Field(() => [OrderItem])
  orderItems: OrderItem[];

  @Field(() => [Payment])
  payment: Payment[];
}