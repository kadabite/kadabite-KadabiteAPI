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

StateSchema.pre<StateDocument>('save', async function (next: (err?: CallbackError | undefined) => void) {
  try {
    const countryId = this.country;
    let country = await Country.findById(countryId as ObjectId);
    if (country) {
      const test = country.states.find((item) => item.toString() === (this._id as ObjectId).toString());
      if (!test) {
        country.states.push(this._id as ObjectId);
        await country.save();
      }
    }
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

LgaSchema.pre<LgaDocument>('save', async function (next: (err?: CallbackError | undefined) => void) {
  try {
    const stateId = this.state;
    let state = await State.findById(stateId as ObjectId);
    if (state) {
      const test = state.lgas.find((item) => item.toString() === (this._id as ObjectId).toString());
      if (!test) {
        state.lgas.push(this._id as MongooseSchemaType.Types.ObjectId);
        await state.save();
      }
    }
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

export const Location = mongoose.models.Location || mongoose.model<LocationDocument>('Location', LocationSchema);
export const Lga = mongoose.models.Lga || mongoose.model<LgaDocument>('Lga', LgaSchema);
export const State = mongoose.models.State || mongoose.model<StateDocument>('State', StateSchema);
export const Country = mongoose.models.Country || mongoose.model<CountryDocument>('Country', CountrySchema);