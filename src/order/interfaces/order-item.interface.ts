import { Document, Types } from 'mongoose';

export interface IOrderItem extends Document {
  productId: Types.ObjectId;
  quantity: number;
  comments?: string;
  ratings?: number;
}