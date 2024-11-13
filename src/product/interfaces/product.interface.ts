import { Document, Types } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  currency: string;
  photo?: string;
  quantity: number;
  categoryId: Types.ObjectId;
  userId: Types.ObjectId;
}
