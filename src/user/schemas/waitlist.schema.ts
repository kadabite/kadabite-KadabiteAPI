import { Schema as MongooseSchema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchemaType } from 'mongoose';

export type WaitListDocument = HydratedDocument<WaitList>;

@MongooseSchema()
export class WaitList {

  @Prop({ unique: true, collation: { locale: 'en', strength: 2 }, maxlength: 100 })
  email: string;

  @Prop({ maxlength: 400 })
  location?: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updatedAt: Date;
}


export const WaitListSchema = SchemaFactory.createForClass(WaitList);
