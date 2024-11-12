import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationResolver } from './location.resolver';
import { Lga, LgaSchema, State, StateSchema, Country, CountrySchema, Location, LocationSchema } from './schemas/location.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  providers: [LocationResolver, LocationService],
  imports: [
    MongooseModule.forFeature([
      { name: Lga.name, schema: LgaSchema },
      { name: State.name, schema: StateSchema },
      { name: Country.name, schema: CountrySchema },
      { name: Location.name, schema: LocationSchema },
    ]),
  ],
})
export class LocationModule {}
