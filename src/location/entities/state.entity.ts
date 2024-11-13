import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Country } from './country.entity';
import { Lga } from '@/location/entities/lga.entity';

@ObjectType()
export class State {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Country)
  country: Country;

  @Field(() => [Lga])
  lgas: Lga[];
}