import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class DeleteUserLocationInput {
  @Field(() => ID)
  @IsUUID()
  locationId: string;
}