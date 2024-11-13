import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ThirdPartyUserDto {
  @Field()
  email: string;

  @Field()
  passwordHash: string;

  @Field()
  username: string;
}