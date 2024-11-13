import { ObjectType, Field, ID } from '@nestjs/graphql';
import { PaymentDto } from '@/payment/dto/payment.dto';

@ObjectType()
export class OrderDto {
  @Field(() => ID)
  id: string;

  @Field()
  currency: string;

  @Field()
  deliveryAddress: string;

  @Field(() => ID, { nullable: true })
  dispatcherId?: string;

  @Field()
  orderDateTime: Date;

  @Field(() => [String])
  orderItems: string[];

  @Field(() => [PaymentDto], { nullable: true })
  payment?: PaymentDto[];

  @Field({ nullable: true })
  paymentToken?: string;

  @Field(() => ID)
  sellerId: string;

  @Field()
  status: string;

  @Field({ nullable: true })
  timeOfDelivery?: Date;

  @Field()
  totalAmount: number;
}