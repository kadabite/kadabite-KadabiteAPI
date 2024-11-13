import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEmail, IsOptional } from 'class-validator';

@InputType()
export class RegisterUserInput {
  @Field()
  @IsString()
  firstName: string;

  @Field()
  @IsString()
  lastName: string;

  @Field()
  @IsString()
  username: string;

  @Field()
  @IsString()
  userType: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  phoneNumber: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  longitude?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  latitude?: string;

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

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  vehicleNumber?: string;
}