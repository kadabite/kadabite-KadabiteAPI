import { ObjectType, Field, ID } from '@nestjs/graphql';
import { CountryDto } from '@/location/dto/country.dto';

@ObjectType()
export class StateDto {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => CountryDto)
  country: CountryDto;
}