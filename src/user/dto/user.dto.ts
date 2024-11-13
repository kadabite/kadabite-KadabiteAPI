import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@ObjectType()
export class UserDto {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  @IsUUID()
  addressBuyer?: string;

  @Field({ nullable: true })
  @IsUUID()
  addressDispatcher?: string;

  @Field({ nullable: true })
  @IsUUID()
  addressSeller?: string;

  @Field({ nullable: true })
  buyerStatus?: string;

  @Field({ nullable: true })
  businessDescription?: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  dispatcherStatus?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field()
  isDeleted: boolean;

  @Field()
  isLoggedIn: boolean;

  @Field({ nullable: true })
  lastName?: string;

  @Field(() => [String])
  locations: string[];

  @Field({ nullable: true })
  phoneNumber?: string;

  @Field({ nullable: true })
  photo?: string;

  @Field(() => [String])
  products: string[];

  @Field({ nullable: true })
  sellerStatus?: string;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  userType?: string;

  @Field({ nullable: true })
  username?: string;

  @Field()
  role: string;

  @Field()
  @IsString()
  vehicleNumber?: string;

  @Field({ nullable: true })
  @IsString()
  refreshToken?: string;
}