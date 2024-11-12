import { CreateLocationInput } from './create-location.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateLocationInput extends PartialType(CreateLocationInput) {
  id: number;
}
