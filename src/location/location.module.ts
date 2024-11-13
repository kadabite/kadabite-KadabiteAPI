import { Module } from '@nestjs/common';
import { LocationService } from '@/location/location.service';
import { LocationResolver } from '@/location/location.resolver';
import { Lga, LgaSchema, State, StateSchema, Country, CountrySchema, Location, LocationSchema, StateDocument, CountryDocument } from '@/location/schemas/location.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CallbackError, Model, ObjectId, Schema } from 'mongoose';

@Module({
  providers: [LocationResolver, LocationService],
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Lga.name,
        useFactory: () => {
          LgaSchema.pre('save', async function (next: (err?: CallbackError | undefined) => void) {
            try {
              const stateId = this.state;
              const state = await (this.model('State') as Model<StateDocument>).findById(stateId as ObjectId);

              if (state) {
                const test = state.lgas.find((item) => item.toString() === (this._id).toString());
                if (!test) {
                  state.lgas.push(this._id as unknown as Schema.Types.ObjectId);
                  await state.save();
                }
              }
              next();
            } catch (error) {
              next(error as CallbackError);
            }
          });
          return LgaSchema;
        },
      },
      {
        name: State.name,
        useFactory: () => {
          StateSchema.pre('save', async function (next: (err?: CallbackError | undefined) => void) {
            try {
              const countryId = this.country;
              const country = await (this.model('Country') as Model<CountryDocument>).findById(countryId as ObjectId);
              if (country) {
                const test = country.states.find((item) => item.toString() === (this._id).toString());
                if (!test) {
                  country.states.push(this._id as unknown as Schema.Types.ObjectId);
                  await country.save();
                }
              }
              next();
            } catch (error) {
              next(error as CallbackError);
            }
          });
          return StateSchema;
        },
      },
      { 
        name: Country.name,
        useFactory: () =>  CountrySchema
      },
      {
        name: Location.name,
        useFactory: () =>  LocationSchema
      },
    ]),
  ],
  exports: [MongooseModule]
})
export class LocationModule {}