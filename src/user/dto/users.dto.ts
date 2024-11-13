import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UsersDto {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  phoneNumber?: string;

  @Field()
  role: string;

  @Field({ nullable: true })
  username?: string;
}