import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { LocationService } from '@/location/location.service';
import { LocationDto } from '@/location/dto/location.dto';
import { CreateLocationInput } from '@/location/dto/create-location.input';
import { AddUserLocationInput } from '@/location/dto/add-user-location.input';
import { UpdateUserLocationInput } from '@/location/dto/update-user-location.input';
import { DeleteUserLocationInput } from '@/location/dto/delete-user-location.input';
import { CountryDto } from '@/location/dto/country.dto';
import { LgaDto } from '@/location/dto/lga.dto';
import { StateDto } from '@/location/dto/state.dto';

@Resolver(() => LocationDto)
export class LocationResolver {
  constructor(private readonly locationService: LocationService) {}

  @Mutation(() => LocationDto)
  createLocation(@Args('createLocationInput') createLocationInput: CreateLocationInput) {
    return this.locationService.create(createLocationInput);
  }

  @Mutation(() => LocationDto)
  addUserLocation(@Args('addUserLocationInput') addUserLocationInput: AddUserLocationInput) {
    return this.locationService.addUserLocation(addUserLocationInput);
  }

  @Mutation(() => LocationDto)
  updateUserLocation(@Args('updateUserLocationInput') updateUserLocationInput: UpdateUserLocationInput) {
    return this.locationService.updateUserLocation(updateUserLocationInput);
  }

  @Mutation(() => LocationDto)
  deleteUserLocation(@Args('deleteUserLocationInput') deleteUserLocationInput: DeleteUserLocationInput) {
    return this.locationService.deleteUserLocation(deleteUserLocationInput.locationId);
  }

  @Query(() => [CountryDto], { name: 'getCountries' })
  getCountries() {
    return this.locationService.getCountries();
  }

  @Query(() => [LgaDto], { name: 'getLgas' })
  getLgas(@Args('state', { type: () => String }) state: string) {
    return this.locationService.getLgas(state);
  }

  @Query(() => [StateDto], { name: 'getStates' })
  getStates(@Args('country', { type: () => String }) country: string) {
    return this.locationService.getStates(country);
  }

  @Query(() => [LocationDto], { name: 'getUserLocations' })
  getUserLocations() {
    return this.locationService.getUserLocations();
  }
}