import { Schema as MongooseSchema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchemaType } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;
type Currency = "Naira" | "Dollar";
export const currency: Currency[] = ["Naira", "Dollar"];

@MongooseSchema()
export class Product {
  @Prop({ required: true, maxlength: 50 })
  name: string;

  @Prop({ maxlength: 50 })
  description?: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updatedAt: Date;

  @Prop({ enum: currency, default: currency[1] })
  currency: string;

  @Prop()
  photo?: string;

  @Prop({ default: 0 })
  quantity: number;

  @Prop({ type: MongooseSchemaType.Types.ObjectId, ref: 'Category', required: true })
  categoryId: MongooseSchemaType.Types.ObjectId;

  @Prop({ type: MongooseSchemaType.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchemaType.Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);