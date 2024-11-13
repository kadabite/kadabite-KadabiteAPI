import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateCategoriesInput {
  @Field(() => [String])
  @IsString({ each: true })
  name: string[];
}