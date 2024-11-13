import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEmail } from 'class-validator';

@InputType()
export class UpdatePasswordInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  token: string;

  @Field()
  @IsString()
  password: string;
}