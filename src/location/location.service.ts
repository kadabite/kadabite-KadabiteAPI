import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CountryDocument, LgaDocument, LocationDocument, StateDocument } from '@/location/schemas/location.schema';
import { MessageDto } from '@/user/dto/message.dto';
import { CreateLocationInput } from '@/location/dto/create-location.input';
import { AddUserLocationInput } from '@/location/dto/add-user-location.input';
import { UpdateUserLocationInput } from '@/location/dto/update-user-location.input';
import { UserDocument } from '@/user/schemas/user.schema';
import { UnauthorizedError } from '@/common/custom-errors/auth/unauthorized.error';
import { CountryNotFoundError } from '@/common/custom-errors/location/country-not-found.error';
import { UserNotFoundError } from '@/common/custom-errors/user/user-not-found.error';
import { StateNotFoundError } from '@/common/custom-errors/location/state-not-found.error';
import { LgaNotFoundError } from '@/common/custom-errors/location/lga-not-found.error';
import { LocationNotFoundError } from '@/common/custom-errors/location/location-not-found.error';
import { DeletionError } from '@/common/custom-errors/location/deletion.error';
import { Connection } from 'mongoose';
import { Addresses }  from '@/common/util/locations';
import { Cache } from 'cache-manager';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel('Location') private locationModel: Model<LocationDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel('Country') private countryModel: Model<CountryDocument>,
    @InjectModel('State') private stateModel: Model<StateDocument>,
    @InjectModel('Lga') private lgaModel: Model<LgaDocument>,
    @InjectModel('User') private userModel: Model<UserDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {}
  private readonly logger = new Logger(LocationService.name);

  async create(createLocationInput: string, addressesData: Addresses): Promise<MessageDto> {
    const session = await this.connection.startSession();

    session.startTransaction();
    try {

      const addresses = addressesData[createLocationInput as unknown as keyof Addresses];
      if (!addresses) {
        throw new CountryNotFoundError('The country was not found in the data provided!');
      }

      // Create the country
      let country = await this.countryModel.findOne({ name: location }).session(session);
      if (!country) {
        country = new this.countryModel({ name: location });
        await country.save({ session });
      }

      for (const state of Object.keys(addresses)) {
        let myState = await this.stateModel.findOne({ name: state, country: country._id }).session(session);
        if (!myState) {
          myState = new this.stateModel({ name: state, country: country._id });
          await myState.save({ session });
        }
        for (const lga of addresses[state as keyof typeof addresses]) {
          let myLga = await this.lgaModel.findOne({ name: lga, state: myState._id }).session(session);
          if (!myLga) {
            myLga = new this.lgaModel({ name: lga, state: myState._id });
            await myLga.save({ session });
          }
        }
      }
      await session.commitTransaction();
      return { message: 'Location created successfully!', statusCode: 200, ok: true };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Error creating location: ' + (error as Error).message);

      if (error instanceof UnauthorizedError || error instanceof CountryNotFoundError) {
        return { message: error.message, statusCode: 400, ok: false };
      }

      return { message: 'An error occurred!', statusCode: 500, ok: false };
    } finally {
      session.endSession();
    }
  }

  async addUserLocation(addUserLocationInput: AddUserLocationInput, userId: string): Promise<MessageDto> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const { address, lga, state, country, longitude, latitude } = addUserLocationInput;

      // Find country
      let countryDoc = await this.countryModel.findOne({ name: country }).session(session);
      if (!countryDoc) {
        throw new CountryNotFoundError('Country not found');
      }

      // Find state
      let stateDoc = await this.stateModel.findOne({ name: state, country: countryDoc._id }).session(session);
      if (!stateDoc) {
        throw new StateNotFoundError('State not found');
      }

      // Find lga
      let lgaDoc = await this.lgaModel.findOne({ name: lga, state: stateDoc._id }).session(session);
      if (!lgaDoc) {
        throw new LgaNotFoundError('LGA not found');
      }

      // Create location
      const location = new this.locationModel({
        name: `${address}, ${lga}, ${state}, ${country}`,
        longitude,
        latitude
      });
      const savedLocation = await location.save({ session });
      const locationId = savedLocation._id;

      // Add location to user
      const userInfo = await this.userModel.findById(userId).session(session);
      if (!userInfo) {
        throw new UserNotFoundError('User not found');
      }
      userInfo.locations.push(locationId as any);
      await userInfo.save({ session });

      await session.commitTransaction();
      return { id: locationId.toString(), statusCode: 201, ok: true, message: 'Location has been created successfully!' };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Error creating location: ' + (error as Error).message);

      if (error instanceof UserNotFoundError || error instanceof CountryNotFoundError || error instanceof StateNotFoundError || error instanceof LgaNotFoundError) {
        return { message: error.message, statusCode: 400, ok: false };
      }

      return { message: 'An error occurred while creating location', statusCode: 500, ok: false };
    } finally {
      session.endSession();
    }
  }

  async updateUserLocation(updateUserLocationInput: UpdateUserLocationInput, userId: string): Promise<MessageDto> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const { locationId, address, lga, state, country, longitude, latitude } = updateUserLocationInput;

      // Find user
      const userInfo = await this.userModel.findById(userId).session(session);
      if (!userInfo) {
        throw new UserNotFoundError('User not found');
      }

      const index = userInfo.locations.findIndex((location: any) => location.toString() === locationId);
      if (index === -1) {
        throw new LocationNotFoundError('Location not found in user\'s locations');
      }

      // Find country
      let countryDoc = await this.countryModel.findOne({ name: country }).session(session);
      if (!countryDoc) {
        throw new CountryNotFoundError('Country not found');
      }

      // Find state
      let stateDoc = await this.stateModel.findOne({ name: state, country: countryDoc._id }).session(session);
      if (!stateDoc) {
        throw new StateNotFoundError('State not found');
      }

      // Find lga
      let lgaDoc = await this.lgaModel.findOne({ name: lga, state: stateDoc._id }).session(session);
      if (!lgaDoc) {
        throw new LgaNotFoundError('LGA not found');
      }

      // Update location
      const location = await this.locationModel.findByIdAndUpdate(locationId, {
        name: `${address}, ${lga}, ${state}, ${country}`,
        longitude,
        latitude
      }, { new: true }).session(session);
      if (!location) {
        throw new LocationNotFoundError('Location not found');
      }

      await session.commitTransaction();
      return { message: 'Location updated successfully!', statusCode: 200, ok: true };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Error updating location: ' + (error as Error).message);

      if (error instanceof UserNotFoundError || error instanceof CountryNotFoundError || error instanceof StateNotFoundError || error instanceof LgaNotFoundError || error instanceof LocationNotFoundError) {
        return { message: error.message, statusCode: 400, ok: false };
      }

      return { message: 'An error occurred while updating location', statusCode: 500, ok: false };
    } finally {
      session.endSession();
    }
  }

  async deleteUserLocation(locationId: string, userId: string): Promise<MessageDto> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      // Find user
      const userInfo = await this.userModel.findById(userId).session(session);
      if (!userInfo) {
        throw new UserNotFoundError('User not found');
      }

      // Find location in user's locations
      const index = userInfo.locations.findIndex((location: any) => location.toString() === locationId);
      if (index === -1) {
        throw new LocationNotFoundError('Location not found in user\'s locations');
      }

      // Remove location from user's locations
      userInfo.locations.splice(index, 1);

      // Delete location document
      const location = await this.locationModel.findByIdAndDelete(locationId).session(session);
      if (!location) {
        throw new DeletionError('Failed to delete location');
      }

      // Save user document
      await userInfo.save({ session });
      await session.commitTransaction();
      return { message: 'Location deleted successfully!', statusCode: 200, ok: true };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Error deleting location: ' + (error as Error).message);

      if (error instanceof UserNotFoundError || error instanceof LocationNotFoundError || error instanceof DeletionError) {
        return { message: error.message, statusCode: 400, ok: false };
      }

      return { message: 'An error occurred!', statusCode: 500, ok: false };
    } finally {
      session.endSession();
    }
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

  async getLgas(state: string): Promise<MessageDto> {
    try {
      // Check if the state data is in the cache
      const cache = await this.cacheManager.get(state);
      if (cache) {
        const parsedData = JSON.parse(cache as string);
        return { lgasData: parsedData, statusCode: 200, ok: true };
      }
  
      // Fetch state data from the database
      const stateData = await this.stateModel.findOne({ state }).populate<{ lgas: LgaDocument[] }>('lgas').exec();
      if (!stateData) return { message: 'State not found!', statusCode: 404, ok: false };
  
      // Transform the data
      const lgasData = stateData.lgas.map((lga: LgaDocument) => ({
        id: lga._id.toString(),
        name: lga.name,
      }));
  
      // Save the data in the cache for 24 hours (86400 seconds)
      await this.cacheManager.set(state, JSON.stringify(lgasData));
  
      return { lgasData, statusCode: 200, ok: true };
    } catch (error) {
      this.logger.error('Error fetching lgas: ' + (error as Error).message);
      return { message: 'An error occurred!', statusCode: 500, ok: false };
    }
  }

  async getStates(country: string): Promise<MessageDto> {
    try {
      // Check if the country data is in the cache
      const cache = await this.cacheManager.get(country);
      if (cache) {
        const parsedData = JSON.parse(cache as string);
        return { statesData: parsedData, statusCode: 200, ok: true };
      }
  
      // Fetch country data from the database
      const countryData = await this.countryModel.findOne({ name: country }).populate<{ states: StateDocument[] }>('states').exec();
      if (!countryData) return { message: 'Country not found!', statusCode: 404, ok: false };
  
      // Transform the data
      const statesData = countryData.states.map((state: StateDocument) => ({
        id: state._id.toString(),
        name: state.name,
      }));
  
      // Save the data in the cache for 24 hours (86400 seconds)
      await this.cacheManager.set(country, JSON.stringify(statesData));
  
      return { statesData, statusCode: 200, ok: true };
    } catch (error) {
      this.logger.error('Error fetching states: ' + (error as Error).message);
      return { message: 'An error occurred!', statusCode: 500, ok: false };
    }
  }

  async getUserLocations(userId: string): Promise<MessageDto> {
    try {
      // Fetch user data from the database
      const userInfo = await this.userModel.findById(userId).populate<{ locations: LocationDocument[]}>('locations').exec();
      if (!userInfo) return { message: 'User not found!', statusCode: 404, ok: false };
  
      // Transform the data
      const locationsData = userInfo.locations.map((location: LocationDocument) => ({
        id: location._id.toString(),
        name: location.name,
        longitude: location.longitude,
        latitude: location.latitude,
      }));
  
      return { locationsData, statusCode: 200, ok: true };
    } catch (error) {
      this.logger.error('Error fetching user locations: ' + (error as Error).message);
      return { message: 'An error occurred!', statusCode: 500, ok: false };
    }
  }
}
