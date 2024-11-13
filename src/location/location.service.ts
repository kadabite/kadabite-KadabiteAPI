import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LocationDocument } from './schemas/location.schema';
import { CreateLocationInput } from './dto/create-location.input';
import { AddUserLocationInput } from './dto/add-user-location.input';
import { UpdateUserLocationInput } from './dto/update-user-location.input';

@Injectable()
export class LocationService {
  constructor(@InjectModel('Location') private locationModel: Model<LocationDocument>) {}

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

  getCountries(): Promise<LocationDocument[]> {
    return this.locationModel.find().exec();
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
