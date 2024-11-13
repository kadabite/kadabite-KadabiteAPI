import { Schema as MongooseSchema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchemaType, CallbackError, ObjectId } from 'mongoose';

export type LocationDocument = HydratedDocument<Location>;
export type LgaDocument = HydratedDocument<Lga>;
export type StateDocument = HydratedDocument<State>;
export type CountryDocument = HydratedDocument<Country>;

@MongooseSchema()
export class Location {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  longitude: string;

  @Prop()
  latitude: string;
}

@MongooseSchema()
export class Lga {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: MongooseSchemaType.Types.ObjectId, ref: 'State', required: true })
  state: MongooseSchemaType.Types.ObjectId;
}

@MongooseSchema()
export class State {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: MongooseSchemaType.Types.ObjectId, ref: 'Country', required: true })
  country: MongooseSchemaType.Types.ObjectId;

  @Prop({ type: [MongooseSchemaType.Types.ObjectId], ref: 'Lga' })
  lgas: MongooseSchemaType.Types.ObjectId[];
}

@MongooseSchema()
export class Country {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: [MongooseSchemaType.Types.ObjectId], ref: 'State' })
  states: MongooseSchemaType.Types.ObjectId[];
}

export const LocationSchema = SchemaFactory.createForClass(Location);
export const LgaSchema = SchemaFactory.createForClass(Lga);
export const StateSchema = SchemaFactory.createForClass(State);
export const CountrySchema = SchemaFactory.createForClass(Country);
