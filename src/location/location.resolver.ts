import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { LocationService } from '@/location/location.service';
import { LocationDto } from '@/location/dto/location.dto';
import { CreateLocationInput } from '@/location/dto/create-location.input';
import { AddUserLocationInput } from '@/location/dto/add-user-location.input';
import { UpdateUserLocationInput } from '@/location/dto/update-user-location.input';
import { CountryDto } from '@/location/dto/country.dto';
import { LgaDto } from '@/location/dto/lga.dto';
import { StateDto } from '@/location/dto/state.dto';
import addressesData  from '@/common/util/locations';
import { AuthGuard } from '@/auth/auth.guard';

@Resolver(() => LocationDto)
export class LocationResolver {
  constructor(private readonly locationService: LocationService) {}

  @Mutation(() => LocationDto, { description: 'Create a new location' })
  @UseGuards(AuthGuard)
  createLocation(@Args() location: CreateLocationInput) {
    return this.locationService.create(location.location, addressesData);
  }

  @Mutation(() => LocationDto, { description: 'Add a location to the current user' })
  @UseGuards(AuthGuard)
  addUserLocation(
    @Args() addUserLocationInput: AddUserLocationInput,
    @Context() context
  ) {
    const userId = context.req.user.sub;
    return this.locationService.addUserLocation(addUserLocationInput, userId);
  }

  @Mutation(() => LocationDto, { description: 'Update a location of the current user' })
  @UseGuards(AuthGuard)
  updateUserLocation(
    @Args() updateUserLocationInput: UpdateUserLocationInput,
    @Context() context
  ) {
    const userId = context.req.user.sub;
    return this.locationService.updateUserLocation(updateUserLocationInput, userId);
  }

  @Mutation(() => LocationDto, { description: 'Delete a location of the current user' })
  @UseGuards(AuthGuard)
  deleteUserLocation(@Args('locationId', { type: () => ID }) locationId: string, @Context() context) {
    const userId = context.req.user.sub;
    return this.locationService.deleteUserLocation(locationId, userId);
  }

  @Query(() => [CountryDto], { name: 'getCountries', description: 'Get all countries' })
  getCountries() {
    return this.locationService.getCountries();
  }

  @Query(() => [LgaDto], { name: 'getLgas', description: 'Get all LGAs of a state' })
  getLgas(@Args('state', { type: () => String }) state: string) {
    return this.locationService.getLgas(state);
  }

  @Query(() => [StateDto], { name: 'getStates', description: 'Get all states of a country' })
  getStates(@Args('country', { type: () => String }) country: string) {
    return this.locationService.getStates(country);
  }

  @Query(() => [LocationDto], { name: 'getUserLocations', description: 'Get all locations of the current user' })
  @UseGuards(AuthGuard)
  getUserLocations(@Context() context) {
    const userId = context.req.user.sub;
    return this.locationService.getUserLocations(userId);
  }
}