import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class DeleteProductInput {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
