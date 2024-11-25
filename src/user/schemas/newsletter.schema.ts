import { Schema as MongooseSchema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchemaType } from 'mongoose';

export type NewsletterDocument = HydratedDocument<Newsletter>;

@MongooseSchema()
export class Newsletter {

  @Prop({ unique: true, collation: { locale: 'en', strength: 2 }, maxlength: 100 })
  email: string;

  @Prop()
  emailToken?: string

  @Prop()
  isRegistered: boolean

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updatedAt: Date;
}


export const NewsletterSchema = SchemaFactory.createForClass(Newsletter);
