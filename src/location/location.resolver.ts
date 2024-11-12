import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { LocationService } from './location.service';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';

@Resolver('Location')
export class LocationResolver {
  constructor(private readonly locationService: LocationService) {}

  @Mutation('createLocation')
  create(@Args('createLocationInput') createLocationInput: CreateLocationInput) {
    return this.locationService.create(createLocationInput);
  }

  @Query('location')
  findAll() {
    return this.locationService.findAll();
  }

  @Query('location')
  findOne(@Args('id') id: number) {
    return this.locationService.findOne(id);
  }

  @Mutation('updateLocation')
  update(@Args('updateLocationInput') updateLocationInput: UpdateLocationInput) {
    return this.locationService.update(updateLocationInput.id, updateLocationInput);
  }

  @Mutation('removeLocation')
  remove(@Args('id') id: number) {
    return this.locationService.remove(id);
  }
}
