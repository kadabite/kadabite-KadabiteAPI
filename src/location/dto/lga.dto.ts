import { ObjectType, Field, ID } from '@nestjs/graphql';
import { StateDto } from '@/location/dto/state.dto';

@ObjectType()
export class LgaDto {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => StateDto)
  state?: StateDto;
}