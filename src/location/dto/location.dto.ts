import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class LocationDto {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  longitude: string;

  @Field()
  latitude: string;
}
