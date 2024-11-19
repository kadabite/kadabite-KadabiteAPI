import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class FindFoodsInput {

  @Field()
  @IsString()
  productName: string;

  @Field()
  @IsNumber()
  limit: number;

  @Field()
  @IsNumber()
  page: number;
}