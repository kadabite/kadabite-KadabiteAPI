import { Schema as MongooseSchema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchemaType } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@MongooseSchema()
export class User {
  @Prop({ maxlength: 50 })
  firstName?: string;

  @Prop({ maxlength: 50 })
  lastName?: string;

  @Prop({ required: true, unique: true, collation: { locale: 'en', strength: 2 }, maxlength: 50 })
  username: string;

  @Prop()
  passwordHash: string;

  @Prop({ collation: { locale: 'en', strength: 2 }, maxlength: 100 })
  email?: string;

  @Prop({ collation: { locale: 'en', strength: 2 }, maxlength: 50 })
  phoneNumber?: string;

  @Prop()
  resetPasswordToken?: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updatedAt: Date;

  @Prop()
  vehicleNumber?: string;

  @Prop({ default: false })
  isLoggedIn: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: false })
  isRegistered: boolean;

  @Prop({ default: 'user' })
  role: string;

  @Prop({ enum: ['seller', 'buyer', 'dispatcher'], default: 'buyer' })
  userType: 'seller' | 'buyer' | 'dispatcher';

  @Prop({ enum: ['available', 'busy', 'null'], default: 'null' })
  sellerStatus: 'available' | 'busy' | 'null';

  @Prop({ enum: ['available', 'busy', 'null'], default: 'null' })
  dispatcherStatus: 'available' | 'busy' | 'null';

  @Prop({ enum: ['available', 'busy', 'null'], default: 'null' })
  buyerStatus: 'available' | 'busy' | 'null';

  @Prop()
  photo?: string;

  @Prop({ type: [MongooseSchemaType.Types.ObjectId], ref: 'Product' })
  products: MongooseSchemaType.Types.ObjectId[];

  @Prop({ type: MongooseSchemaType.Types.ObjectId, ref: 'Location' })
  addressSeller?: MongooseSchemaType.Types.ObjectId;

  @Prop({ type: MongooseSchemaType.Types.ObjectId, ref: 'Location' })
  addressBuyer?: MongooseSchemaType.Types.ObjectId;

  @Prop({ type: MongooseSchemaType.Types.ObjectId, ref: 'Location' })
  addressDispatcher?: MongooseSchemaType.Types.ObjectId;

  @Prop({ maxlength: 300 })
  businessDescription?: string;

  @Prop({ type: [MongooseSchemaType.Types.ObjectId], ref: 'Location' })
  locations: MongooseSchemaType.Types.ObjectId[];

  @Prop()
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
