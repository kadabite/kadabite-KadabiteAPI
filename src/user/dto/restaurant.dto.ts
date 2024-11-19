import { ObjectType, Field, ID } from '@nestjs/graphql';
import { LocationDto } from '@/location/dto/location.dto';
import { IsUUID, IsString, IsEmail, IsNumber } from 'class-validator';

@ObjectType()
export class RestaurantDto {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => LocationDto, { nullable: true })
  addressSeller?: LocationDto;

  @Field({ nullable: true })
  @IsString()
  businessDescription?: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  @IsString()
  currency?: string;

  @Field({ nullable: true })
  @IsString()
  description?: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsString()
  phoneNumber?: string;

  @Field({ nullable: true })
  @IsString()
  photo?: string;

  @Field({ nullable: true })
  @IsNumber()
  price?: number;

  @Field(() => [String])
  @IsString({ each: true })
  products: string[];

  @Field()
  @IsUUID()
  userId: string;

  @Field()
  @IsString()
  username: string;
}