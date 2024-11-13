import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class AddUserLocationInput {
  @Field()
  @IsString()
  address: string;

  @Field()
  @IsString()
  lga: string;

  @Field()
  @IsString()
  state: string;

  @Field()
  @IsString()
  country: string;

  @Field()
  @IsString()
  longitude: string;

  @Field()
  @IsString()
  latitude: string;
}
