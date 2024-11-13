import { InputType, Field, ID } from '@nestjs/graphql';
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductInput } from './create-product.input';

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {
  @Field(() => ID)
  id: string;
}