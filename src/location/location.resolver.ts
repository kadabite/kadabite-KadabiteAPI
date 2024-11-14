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
import addressesData  from '@/common/util/locations';

@Resolver(() => LocationDto)
export class LocationResolver {
  constructor(private readonly locationService: LocationService) {}

  @Mutation(() => LocationDto)
  createLocation(@Args('createLocationInput') createLocationInput: CreateLocationInput) {

    return this.locationService.create(createLocationInput, addressesData);
  }

  @Mutation(() => LocationDto)
  addUserLocation(@Args('addUserLocationInput') addUserLocationInput: AddUserLocationInput) {
    const userId = '60b4d1b4b3f4f00015f2f3b4';
    return this.locationService.addUserLocation(addUserLocationInput, userId);
  }

  @Mutation(() => LocationDto)
  updateUserLocation(@Args('updateUserLocationInput') updateUserLocationInput: UpdateUserLocationInput) {
    const userId = '60b4d1b4b3f4f00015f2f3b4';
    return this.locationService.updateUserLocation(updateUserLocationInput, userId);
  }

  @Mutation(() => LocationDto)
  deleteUserLocation(@Args('deleteUserLocationInput') deleteUserLocationInput: DeleteUserLocationInput) {
    const userId = '60b4d1b4b3f4f00015f2f3b4';
    return this.locationService.deleteUserLocation(deleteUserLocationInput.locationId, userId);
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
    return this.locationService.getUserLocations('60b4d1b4b3f4f00015f2f3b4');
  }
}