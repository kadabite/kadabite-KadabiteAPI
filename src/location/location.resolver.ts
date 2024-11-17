import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
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
import { AuthGuard } from '@/auth/auth.guard';

@Resolver(() => LocationDto)
export class LocationResolver {
  constructor(private readonly locationService: LocationService) {}

  @Mutation(() => LocationDto)
  @UseGuards(AuthGuard)
  createLocation(@Args('location') location: CreateLocationInput) {

    return this.locationService.create(location, addressesData);
  }

  @Mutation(() => LocationDto)
  @UseGuards(AuthGuard)
  addUserLocation(
    @Args('address', { type: () => String }) address: string,
    @Args('lga', { type: () => String, nullable: true }) lga: string,
    @Args('state', { type: () => String, nullable: true }) state: string,
    @Args('country', { type: () => String, nullable: true }) country: string,
    @Args('longitude', { type: () => String, nullable: true }) longitude: string,
    @Args('latitude', { type: () => String, nullable: true }) latitude: string,
    @Context() context
  ) {
    const userId = context.req.user.sub;
    return this.locationService.addUserLocation({ address, lga, state, country, longitude, latitude }, userId);
  }

  @Mutation(() => LocationDto)
  @UseGuards(AuthGuard)
  updateUserLocation(
    @Args('locationId', { type: () => ID }) locationId: string,
    @Args('address', { type: () => String }) address: string,
    @Args('lga', { type: () => String }) lga: string,
    @Args('state', { type: () => String }) state: string,
    @Args('country', { type: () => String }) country: string,
    @Args('longitude', { type: () => String }) longitude: string,
    @Args('latitude', { type: () => String }) latitude: string,
    @Context() context
  ) {
    const userId = context.req.user.sub;
    return this.locationService.updateUserLocation({ locationId, address, lga, state, country, longitude, latitude }, userId);
  }

  @Mutation(() => LocationDto)
  @UseGuards(AuthGuard)
  deleteUserLocation(@Args('locationId', { type: () => ID }) locationId: string, @Context() context) {
    const userId = context.req.user.sub;
    return this.locationService.deleteUserLocation(locationId, userId);
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
  @UseGuards(AuthGuard)
  getUserLocations(@Context() context) {
    const userId = context.req.user.sub;
    return this.locationService.getUserLocations(userId);
  }
}