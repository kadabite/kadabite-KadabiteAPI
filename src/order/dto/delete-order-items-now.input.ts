import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID, IsArray } from 'class-validator';

@InputType()
export class DeleteOrderItemsNowInput {
  @Field(() => [ID])
  @IsArray()
  @IsUUID('all', { each: true })
  ids: string[];
}