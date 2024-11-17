import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsInt, IsUUID } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  description: string;

  @Field()
  @IsInt()
  price: number;

  @Field()
  @IsString()
  currency: string;

  @Field()
  @IsString()
  photo?: string;

  @Field(() => ID)
  @IsUUID()
  categoryId: string;
}