import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateLocationInput {
  @Field()
  @IsString()
  location: string;
}