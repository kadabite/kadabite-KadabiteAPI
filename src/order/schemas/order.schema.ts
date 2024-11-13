import { Schema as MongooseSchema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchemaType } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;
export type OrderItemDocument = HydratedDocument<OrderItem>;

@MongooseSchema()
export class OrderItem {
  @Prop({ type: MongooseSchemaType.Types.ObjectId, ref: 'Product', required: true })
  productId: MongooseSchemaType.Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop()
  comments?: string;

  @Prop()
  ratings?: number;
}

@MongooseSchema()
export class Order {
  @Prop({ type: MongooseSchemaType.Types.ObjectId, ref: 'User' })
  sellerId: MongooseSchemaType.Types.ObjectId;

  @Prop({ type: MongooseSchemaType.Types.ObjectId, ref: 'User' })
  buyerId: MongooseSchemaType.Types.ObjectId;

  @Prop({ type: MongooseSchemaType.Types.ObjectId, ref: 'User' })
  dispatcherId: MongooseSchemaType.Types.ObjectId;

  @Prop({ default: new Date() })
  orderDateTime: Date;

  @Prop()
  timeOfDelivery: Date;

  @Prop({ default: false })
  recievedByBuyer: boolean;

  @Prop({ default: false })
  deliveredByDispatcher: boolean;

  @Prop()
  deliveryAddress: string;

  @Prop()
  currency: string;

  @Prop()
  totalAmount: number;

  @Prop({ enum: ['completed', 'incomplete', 'pending'], default: 'incomplete' })
  status: 'completed' | 'incomplete' | 'pending';

  @Prop({ type: [MongooseSchemaType.Types.ObjectId], ref: 'OrderItem' })
  orderItems: MongooseSchemaType.Types.ObjectId[];

  @Prop({ type: [MongooseSchemaType.Types.ObjectId], ref: 'Payment' })
  payment: MongooseSchemaType.Types.ObjectId[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

