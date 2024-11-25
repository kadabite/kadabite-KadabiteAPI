import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsString, IsEmail, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';


@InputType()
export class WaitListInput {

  @Field()
  @IsEmail()
  email: string;

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
  address: string;
}

@ObjectType()
export class WaitListDto extends PartialType(WaitListInput) {

  @Field()
  createdAt: Date
}
