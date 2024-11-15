import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Connection, Model } from 'mongoose';
import { UserDocument } from '@/user/schemas/user.schema';
import { CreateUserInput } from '@/user/dto/create-user.input';
import { CountryDocument, StateDocument, LgaDocument, LocationDocument } from '@/location/schemas/location.schema';
import { UpdateUserInput } from '@/user/dto/update-user.input';
import { RegisterUserInput } from '@/user/dto/register-user.input';
import { MessageDto } from '@/user/dto/message.dto';
import { UserDto } from '@/user/dto/user.dto';
import { ThirdPartyUserDto } from '@/user/dto/third-party-user.dto';
import { UserNotFoundError } from '@/common/custom-errors/user/user-not-found.error';
import { InvalidCredentialsError, InvalidInputError } from '@/common/custom-errors/user/invalid-credentials.error';
import { UserAlreadyExistsError } from '@/common/custom-errors/user/user-already-exists.error';
import { CountryNotFoundError } from '@/common/custom-errors/location/country-not-found.error';
import { StateNotFoundError } from '@/common/custom-errors/location/state-not-found.error';
import { LgaNotFoundError } from '@/common/custom-errors/location/lga-not-found.error';
import { InvalidTokenError, TokenExpiredError } from '@/common/custom-errors/auth/unauthorized.error';
import * as bcrypt from 'bcrypt';



import _ from 'lodash';
import { ProductDocument } from '@/product/schemas/product.schema';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    @InjectModel('Country') private countryModel: Model<CountryDocument>,
    @InjectModel('State') private stateModel: Model<StateDocument>,
    @InjectModel('Lga') private lgaModel: Model<LgaDocument>,
    @InjectModel('Location') private locationModel: Model<LocationDocument>,
    @InjectModel('Product') private productModel: Model<ProductDocument>,
    @InjectConnection() private readonly connection: Connection
  ) {}

  async create(createUserInput: CreateUserInput): Promise<MessageDto> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const { email, password, phoneNumber } = createUserInput;

      // Check if email or phoneNumber is provided
      if (!email && !phoneNumber) {
        throw new InvalidCredentialsError('Email or phone number must be provided');
      }

      // Check if email or phoneNumber is already taken
      let existingUser: UserDocument;
      if (email) {
        existingUser = await this.userModel.findOne({ email }).session(session);
      } else if (phoneNumber) {
        existingUser = await this.userModel.findOne({ phoneNumber }).session(session);
      } else {
        existingUser = null;
        throw new InvalidCredentialsError();
      }

      if (existingUser) {
        throw new UserAlreadyExistsError();
      }

      // Determine username
      let username: string;
      if (email) {
        username = _.trim(email);
      } else if (phoneNumber) {
        username = _.trim(phoneNumber);
      }

      // Create new user
      const newUser = new this.userModel({
        username: _.trim(username),
        email: email ? _.trim(email) : '',
        passwordHash: _.trim(password),
        phoneNumber: phoneNumber ? _.trim(phoneNumber) : '',
        isRegistered: false, // Set isRegistered to false
      });
      const userData = await newUser.save({ session });
      await session.commitTransaction();
      return { userData: this.toUserDto(userData), statusCode: 201, ok: true, message: 'User has been registered successfully!' };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Error creating user: ' + (error as Error).message);

      if (error instanceof UserAlreadyExistsError || error instanceof InvalidCredentialsError) {
        return { message: error.message, statusCode: 400, ok: false };
      }

      return { message: 'An error occurred while creating user', statusCode: 500, ok: false };
    } finally {
      session.endSession();
    }
  }

  async findAll(): Promise<MessageDto> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const usersData = await this.userModel.find().session(session).exec();

      await session.commitTransaction();
      return { usersData, statusCode: 200, ok: true };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Error fetching users: ' + (error as Error).message);

      return { message: 'An error occurred!', statusCode: 500, ok: false };
    } finally {
      session.endSession();
    }
  }

  async findOne(userId: string): Promise<MessageDto> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const userData = await this.userModel.findById(userId).session(session);
      if (!userData) {
        throw new UserNotFoundError('User not found');
      }

      await session.commitTransaction();
      return { userData: this.toUserDto(userData), statusCode: 200, ok: true };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Error fetching user: ' + (error as Error).message);

      if (error instanceof UserNotFoundError) {
        return { message: error.message, statusCode: 404, ok: false };
      }

      return { message: 'An error occurred!', statusCode: 500, ok: false };
    } finally {
      session.endSession();
    }
  }

  async update(userId: string, updateUserInput: UpdateUserInput): Promise<MessageDto> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const {
        firstName,
        lastName,
        vehicleNumber,
        buyerStatus,
        sellerStatus,
        dispatcherStatus,
      } = updateUserInput;

      const newArgs = {
        firstName,
        lastName,
        vehicleNumber,
        buyerStatus,
        sellerStatus,
        dispatcherStatus,
      };

      // Filter out undefined values
      const keys = Object.keys(newArgs);
      const filteredArgs = keys.reduce((acc: Partial<UpdateUserInput>, key) => {
        if (newArgs[key as keyof UpdateUserInput] !== undefined) {
          acc[key as keyof UpdateUserInput] = newArgs[key as keyof UpdateUserInput];
        }
        return acc;
      }, {});

      const updatedUser = await this.userModel.findByIdAndUpdate(userId, filteredArgs, { new: true }).session(session);
      if (!updatedUser) {
        throw new UserNotFoundError('User not found');
      }

      await session.commitTransaction();
      return { message: 'Updated successfully', statusCode: 200, ok: true, userData: this.toUserDto(updatedUser) };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Error updating user: ' + (error as Error).message);

      if (error instanceof UserNotFoundError) {
        return { message: error.message, statusCode: 404, ok: false };
      }

      return { message: 'An error occurred!', statusCode: 500, ok: false };
    } finally {
      session.endSession();
    }
  }

  async remove(id: string): Promise<UserDto> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    return this.toUserDto(deletedUser);
  }

  async delete(userId: string): Promise<MessageDto> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const delUser = await this.userModel.findByIdAndUpdate(userId, { isDeleted: true }).session(session);
      if (!delUser) {
        throw new UserNotFoundError('User not found');
      }

      await session.commitTransaction();
      return { message: 'User deleted successfully!', statusCode: 200, ok: true };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Error deleting user: ' + (error as Error).message);

      if (error instanceof UserNotFoundError) {
        return { message: error.message, statusCode: 404, ok: false };
      }

      return { message: 'An error occurred!', statusCode: 500, ok: false };
    } finally {
      session.endSession();
    }
  }

  async forgotPassword(email: string): Promise<MessageDto> {
    // Implement logic for forgot password
    return { message: 'Password reset email sent', ok: true, statusCode: 200 };
  }

  async login(email: string, password: string): Promise<MessageDto> {
    // Implement logic for user login
    return { message: 'Login successful', ok: true, statusCode: 200 };
  }

  async logout(userId: string): Promise<MessageDto> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      // Update the user information to be logged out
      const updatedUser = await this.userModel.findByIdAndUpdate(userId, { isLoggedIn: false }).session(session);
      if (!updatedUser) {
        throw new UserNotFoundError('User not found');
      }

      await session.commitTransaction();
      return { message: 'Logged out successfully', statusCode: 200, ok: true };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Error logging out: ' + (error as Error).message);

      if (error instanceof UserNotFoundError) {
        return { message: error.message, statusCode: 404, ok: false };
      }

      return { message: 'An error occurred!', statusCode: 500, ok: false };
    } finally {
      session.endSession();
    }
  }

  async register(registerUserInput: RegisterUserInput, userId: string): Promise<MessageDto> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const {
        username,
        email,
        phoneNumber,
        userType,
        firstName,
        lastName,
        vehicleNumber,
        latitude,
        longitude,
        lga,
        state,
        country,
        address
      } = registerUserInput;

      // Check if user exists
      const existingUser = await this.userModel.findById(userId).session(session);
      if (!existingUser) {
        throw new UserNotFoundError('User not found');
      }

      // Check if user is already registered
      if (existingUser.isRegistered) {
        return { message: 'User is already registered!', statusCode: 400, ok: false };
      }

      // Ensure address, lga, state, and country are provided
      if (!address || !lga || !state || !country) {
        throw new InvalidInputError('Address, LGA, state, and country are mandatory.');
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

      // Create location
      const location = new this.locationModel({
        name: `${address}, ${lga}, ${state}, ${country}`,
        longitude,
        latitude
      });
      const savedLocation = await location.save({ session });
      const locationId = savedLocation.id;

      // Update user
      existingUser.firstName = _.trim(firstName);
      existingUser.lastName = _.trim(lastName);
      existingUser.username = _.trim(username);
      existingUser.email = existingUser.email ? existingUser.email : _.trim(email);
      existingUser.phoneNumber = existingUser.phoneNumber ? existingUser.phoneNumber : _.trim(phoneNumber);
      if (userType && ["seller", "buyer", "dispatcher"].includes(userType)) {
        existingUser.userType = userType as UserDocument["userType"];
      }
      existingUser.vehicleNumber = vehicleNumber ? _.trim(vehicleNumber) : existingUser.vehicleNumber;
      existingUser.locations = locationId ? [locationId] : [];
      existingUser.isRegistered = true; // Set isRegistered to true

      const updatedUser = await existingUser.save({ session });
      await session.commitTransaction();
      return { userData: this.toUserDto(updatedUser), statusCode: 200, ok: true, message: 'User has been registered successfully!' };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Error updating user: ' + (error as Error).message);

      if (error instanceof UserNotFoundError || error instanceof CountryNotFoundError || error instanceof StateNotFoundError || error instanceof LgaNotFoundError) {
        return { message: error.message, statusCode: 400, ok: false };
      }

      return { message: 'An error occurred while updating user', statusCode: 500, ok: false };
    } finally {
      session.endSession();
    }
  }

  async updatePassword(email: string, token: string, password: string): Promise<MessageDto> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      email = _.trim(email);
      const user = await this.userModel.findOne({ email }).session(session);
      if (!user) {
        throw new UserNotFoundError('User was not found');
      }

      const resetPasswordToken = user.resetPasswordToken;
      if (!resetPasswordToken) {
        throw new InvalidTokenError('Reset password token is missing');
      }

      const [storedToken, expiryDateStr] = resetPasswordToken.split(' ');
      const expiryDate = new Date(expiryDateStr);
      const presentDate = new Date();

      if (expiryDate <= presentDate) {
        throw new TokenExpiredError('Reset password token has expired');
      }

      if (token !== storedToken) {
        throw new InvalidTokenError('Invalid reset password token');
      }

      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);

      await this.userModel.findByIdAndUpdate(user.id, { passwordHash, resetPasswordToken: null }).session(session);

      await session.commitTransaction();
      return { message: 'Password updated successfully', statusCode: 200, ok: true };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Error updating password: ' + (error as Error).message);

      if (error instanceof UserNotFoundError || error instanceof InvalidTokenError || error instanceof TokenExpiredError) {
        return { message: error.message, statusCode: 401, ok: false };
      }

      return { message: 'An error occurred!', statusCode: 500, ok: false };
    } finally {
      session.endSession();
    }
  }

  async findUser(): Promise<MessageDto> {
    const user = await this.userModel.findOne().exec();
    return { userData: this.toUserDto(user), ok: true, statusCode: 200 };
  }

  async findUsers(): Promise<MessageDto> {
    const users = await this.userModel.find().exec();
    return { usersData: users.map(user => this.toUserDto(user)), ok: true, statusCode: 200 };
  }

  async findFoods(productName: string, page: number, limit: number): Promise<MessageDto> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      // Find the products by their name
      const productsData = await this.productModel
        .find({ name: new RegExp(_.trim(productName), 'i') })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      if (!productsData || productsData.length === 0) {
        return { message: 'No product was found!', statusCode: 404, ok: false };
      }

      // Fetch user information and map the data
      const foodsData = await Promise.all(productsData.map(async (data) => {
        const user = await this.userModel.findById(data.userId).session(session);
        const location = await this.locationModel.findById(user?.addressSeller).exec();
        return {
          id: data._id.toString(),
          name: data.name,
          description: data.description,
          price: data.price,
          currency: data.currency,
          userId: data.userId.toString(),
          username: user?.username,
          businessDescription: user?.businessDescription,
          products: user?.products.map(product => product.toString()),
          phoneNumber: user?.phoneNumber,
          email: user?.email,
          createdAt: data.createdAt,
          photo: data.photo,
          addressSeller: {
            id: location._id.toString(),
            name: location.name,
            longitude: location.longitude,
            latitude: location.latitude,
          },
        };
      }));

      // Calculate pagination details
      const totalItems = await this.productModel.countDocuments({ name: new RegExp(_.trim(productName), 'i') }).exec();
      const totalPages = Math.ceil(totalItems / limit);
      const pagination = {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      };

      await session.commitTransaction();
      return { foodsData, pagination, statusCode: 200, ok: true };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Error fetching foods: ' + (error as Error).message);
      return { message: 'An error occurred!', statusCode: 500, ok: false };
    } finally {
      session.endSession();
    }
  }

  async findThirdPartyUser(username: string): Promise<ThirdPartyUserDto> {
    // Implement logic to find third-party user by username
    return { username, email: 'example@example.com', passwordHash: 'hashed_password' };
  }

  private toUserDto(user: UserDocument): UserDto {
    return {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      phoneNumber: user.phoneNumber,
      vehicleNumber: user.vehicleNumber,
      isLoggedIn: user.isLoggedIn,
      isDeleted: user.isDeleted,
      userType: user.userType,
      buyerStatus: user.buyerStatus,
      sellerStatus: user.sellerStatus,
      dispatcherStatus: user.dispatcherStatus,
      photo: user.photo,
      locations: user.locations.map(location => location.toString()),
      products: user.products.map(product => product.toString()),
      addressSeller: user.addressSeller.toString(),
      addressBuyer: user.addressBuyer.toString(),
      addressDispatcher: user.addressDispatcher.toString(),
      businessDescription: user.businessDescription,
      refreshToken: user.refreshToken,
      role: user.role,
    };
  }
}
