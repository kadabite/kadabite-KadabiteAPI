import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsUUID, IsInt, IsOptional } from 'class-validator';

@InputType()
export class OrderItem2Input {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  comments?: string;

  @Field({ nullable: true })
  @IsInt()
  @IsOptional()
  quantity?: number;

  @Field({ nullable: true })
  @IsInt()
  @IsOptional()
  ratings?: number;
}