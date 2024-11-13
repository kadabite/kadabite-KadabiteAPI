import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Location {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  longitude?: string;

  @Field({ nullable: true })
  latitude?: string;
}