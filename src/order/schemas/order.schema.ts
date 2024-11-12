import { Schema as MongooseSchema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchemaType } from 'mongoose';
import { IProduct, Product } from '@/models/product';
import { IOrderItem, OrderItem } from '@/models/orderItem';
import { IPayment } from '@/models/payment';

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
  orderItems: MongooseSchemaType.Types.ObjectId[] | IOrderItem[];

  @Prop({ type: [MongooseSchemaType.Types.ObjectId], ref: 'Payment' })
  payment: MongooseSchemaType.Types.ObjectId[] | IPayment[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// Pre-save hook to calculate total amount
OrderSchema.pre<OrderDocument>('save', async function (next) {
  const items = this.orderItems;
  let totalAmount = 0;

  for (const item of items) {
    const orderItem = await OrderItem.findById(item.toString());
    if (orderItem?.productId) {
      const product = await Product.findById(orderItem.productId.toString());
      if (product?.price && orderItem?.quantity) {
        totalAmount += product.price * orderItem.quantity;
      }
    }
  }

  this.totalAmount = totalAmount;
  next();
});

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
export const OrderItem = mongoose.models.OrderItem || mongoose.model<OrderItemDocument>('OrderItem', OrderItemSchema);

