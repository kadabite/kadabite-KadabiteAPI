import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  longitude?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  latitude?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  userName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  lga?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  state?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  country?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  buyerStatus?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  sellerStatus?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  dispatcherStatus?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  vehicleNumber?: string;
}