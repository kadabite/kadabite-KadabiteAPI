import { InputType, Field, ID } from '@nestjs/graphql';
import { IsBoolean, IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateOrderInput {
  @Field(() => ID)
  @IsUUID()
  orderId: string;

  @Field()
  @IsString()
  deliveryAddress?: string;

  @Field()
  @IsBoolean()
  recievedByBuyer?: boolean;

  @Field()
  @IsBoolean()
  deliveredByDispatcher?: boolean;
}