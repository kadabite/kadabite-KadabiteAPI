import { Schema as MongooseSchema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchemaType } from 'mongoose';

// Define types for the functions
export type PaymentMethod = "transfer" | "cash" | "pos";
export type Currency = "Naira" | "Dollar";
export type PaymentStatus = "inprocess" | "unpaid" | "paid";

// Define constants with specific types
export const paymentMethods: PaymentMethod[] = ["transfer", "cash", "pos"];
export const currency: Currency[] = ["Naira", "Dollar"];
export const paymentStatus: PaymentStatus[] = ["inprocess", "unpaid", "paid"];

export type PaymentDocument = HydratedDocument<Payment>;

@MongooseSchema()
export class Payment {
  @Prop({ type: MongooseSchemaType.Types.ObjectId, ref: 'Order', required: true })
  orderId: MongooseSchemaType.Types.ObjectId;

  @Prop({ required: true })
  paymentDateTime: Date;

  @Prop({ default: new Date() })
  lastUpdateTime: Date;

  @Prop({ enum: paymentMethods, default: paymentMethods[0] })
  paymentMethod: string;

  @Prop({ enum: currency, default: currency[1] })
  currency: string;

  @Prop({ default: 0 })
  sellerAmount: number;

  @Prop({ default: 0 })
  dispatcherAmount: number;

  @Prop({ enum: paymentStatus, default: paymentStatus[1] })
  sellerPaymentStatus: string;

  @Prop({ enum: paymentStatus, default: paymentStatus[1] })
  dispatcherPaymentStatus: string;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
