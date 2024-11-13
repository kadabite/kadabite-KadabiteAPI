import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  phoneNumber: string;

  @Field()
  vehicleNumber: string;

  @Field()
  isLoggedIn: boolean;

  @Field()
  isDeleted: boolean;

  @Field()
  userType: string;

  @Field()
  buyerStatus: string;

  @Field()
  sellerStatus: string;

  @Field()
  dispatcherStatus: string;

  @Field({ nullable: true })
  photo?: string;

  @Field(() => [String])
  locations: string[];

  @Field(() => [String])
  products: string[];

  @Field({ nullable: true })
  addressSeller?: string;

  @Field({ nullable: true })
  addressBuyer?: string;

  @Field({ nullable: true })
  addressDispatcher?: string;

  @Field({ nullable: true })
  businessDescription?: string;

  @Field({ nullable: true })
  refreshToken?: string;
}