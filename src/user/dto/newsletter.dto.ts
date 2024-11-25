import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsUUID } from 'class-validator';
import {  } from 'class-validator';

@InputType()
export class NewsletterInput {

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsUUID()
  emailToken?: string;
}