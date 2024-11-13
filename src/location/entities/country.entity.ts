import { ObjectType, Field, ID } from '@nestjs/graphql';
import { State } from '@/location/entities/state.entity';

@ObjectType()
export class Country {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => [State])
  states: State[];
}