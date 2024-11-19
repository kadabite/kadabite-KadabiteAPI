import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IsString, IsUUID, IsEmail } from 'class-validator';

@ObjectType()
export class UserDto {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field({ nullable: true })
  @IsString()
  addressBuyer?: string;

  @Field({ nullable: true })
  @IsString()
  addressDispatcher?: string;

  @Field({ nullable: true })
  @IsString()
  addressSeller?: string;

  @Field({ nullable: true })
  @IsString()
  buyerStatus?: string;

  @Field({ nullable: true })
  @IsString()
  businessDescription?: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  @IsString()
  dispatcherStatus?: string;

  @Field({ nullable: true })
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsString()
  firstName?: string;

  @Field()
  isDeleted: boolean;

  @Field()
  isLoggedIn: boolean;

  @Field({ nullable: true })
  @IsString()
  lastName?: string;

  @Field(() => [String])
  @IsString({ each: true })
  locations: string[];

  @Field({ nullable: true })
  @IsString()
  phoneNumber?: string;

  @Field({ nullable: true })
  @IsString()
  photo?: string;

  @Field(() => [String])
  @IsString({ each: true })
  products: string[];

  @Field({ nullable: true })
  @IsString()
  sellerStatus?: string;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  @IsString()
  userType?: string;

  @Field({ nullable: true })
  @IsString()
  username?: string;

  @Field()
  @IsString()
  role: string;

  @Field()
  @IsString()
  vehicleNumber?: string;

  @Field({ nullable: true })
  @IsString()
  refreshToken?: string;
}