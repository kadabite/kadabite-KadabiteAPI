import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateUserLocationInput {
  @Field(() => ID)
  @IsUUID()
  locationId: string;

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
