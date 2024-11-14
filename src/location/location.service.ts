import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CacheStore } from '@nestjs/cache-manager';
import { CountryDocument, LocationDocument } from '@/location/schemas/location.schema';
import { MessageDto } from '@/user/dto/message.dto';
import { CreateLocationInput } from '@/location/dto/create-location.input';
import { AddUserLocationInput } from '@/location/dto/add-user-location.input';
import { UpdateUserLocationInput } from '@/location/dto/update-user-location.input';


@Injectable()
export class LocationService {
  constructor(
    @InjectModel('Location') private locationModel: Model<LocationDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
    @InjectModel('Country') private countryModel: Model<CountryDocument>,
  ) {}
  private readonly logger = new Logger(LocationService.name);

  create(createLocationInput: CreateLocationInput): Promise<LocationDocument> {
    const createdLocation = new this.locationModel(createLocationInput);
    return createdLocation.save();
  }

  addUserLocation(addUserLocationInput: AddUserLocationInput): Promise<LocationDocument> {
    const createdLocation = new this.locationModel(addUserLocationInput);
    return createdLocation.save();
  }

  updateUserLocation(updateUserLocationInput: UpdateUserLocationInput): Promise<LocationDocument> {
    return this.locationModel.findByIdAndUpdate(updateUserLocationInput.locationId, updateUserLocationInput, { new: true }).exec();
  }

  deleteUserLocation(locationId: string): Promise<LocationDocument> {
    return this.locationModel.findByIdAndDelete(locationId).exec();
  }

  async getCountries(): Promise<MessageDto> {
    try {
      const cache = await this.cacheManager.get('countries');
      if (cache) {
        const parsedData = JSON.parse(cache as string);
        return { countriesData: parsedData, statusCode: 200, ok: true };
      }
      const countriesData = await this.countryModel.find().exec();
      if (!countriesData) return { message: 'No country was found!', statusCode: 404, ok: false }
      const transformedData = countriesData.map((country: any) => ({
        id: country._id,
        name: country.name,
      }));
      await this.cacheManager.set('countries', JSON.stringify(transformedData));
      return { countriesData: transformedData, statusCode: 200, ok: true };
    } catch (error) {
      this.logger.error('Error fetching countries: ' + (error as Error).message);
      return { message: 'An error occurred!', statusCode: 500, ok: false };
    }
  }

  getLgas(state: string): Promise<LocationDocument[]> {
    return this.locationModel.find({ state }).exec();
  }

  getStates(country: string): Promise<LocationDocument[]> {
    return this.locationModel.find({ country }).exec();
  }

  getUserLocations(): Promise<LocationDocument[]> {
    return this.locationModel.find().exec();
  }
}
