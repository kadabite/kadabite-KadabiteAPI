import { ObjectType, Field, ID } from '@nestjs/graphql';
import { LocationDto } from '@/location/dto/location.dto';

@ObjectType()
export class RestaurantDto {
  @Field(() => ID)
  id: string;

  @Field(() => LocationDto, { nullable: true })
  addressSeller?: LocationDto;

  @Field({ nullable: true })
  businessDescription?: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  currency?: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  phoneNumber?: string;

  @Field({ nullable: true })
  photo?: string;

  @Field({ nullable: true })
  price?: number;

  @Field(() => [String])
  products: string[];

  @Field()
  userId: string;

  @Field()
  username: string;
}