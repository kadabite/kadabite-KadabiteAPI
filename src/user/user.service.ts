import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '@/user/schemas/user.schema';
import { CreateUserInput } from '@/user/dto/create-user.input';
import { UpdateUserInput } from '@/user/dto/update-user.input';
import { RegisterUserInput } from '@/user/dto/register-user.input';
import { MessageDto } from '@/user/dto/message.dto';
import { UserDto } from '@/user/dto/user.dto';
import { ThirdPartyUserDto } from '@/user/dto/third-party-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async create(createUserInput: CreateUserInput): Promise<UserDto> {
    const createdUser = new this.userModel(createUserInput);
    const savedUser = await createdUser.save();
    return this.toUserDto(savedUser);
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.userModel.find().exec();
    return users.map(user => this.toUserDto(user));
  }

  async findOne(id: string): Promise<UserDto> {
    const user = await this.userModel.findById(id).exec();
    return this.toUserDto(user);
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<UserDto> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserInput, { new: true }).exec();
    return this.toUserDto(updatedUser);
  }

  async remove(id: string): Promise<UserDto> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    return this.toUserDto(deletedUser);
  }

  async delete(): Promise<MessageDto> {
    // Implement logic to delete a user
    return { message: 'User deleted successfully', ok: true, statusCode: 200 };
  }

  async forgotPassword(email: string): Promise<MessageDto> {
    // Implement logic for forgot password
    return { message: 'Password reset email sent', ok: true, statusCode: 200 };
  }

  async login(email: string, password: string): Promise<MessageDto> {
    // Implement logic for user login
    return { message: 'Login successful', ok: true, statusCode: 200 };
  }

  async logout(): Promise<MessageDto> {
    // Implement logic for user logout
    return { message: 'Logout successful', ok: true, statusCode: 200 };
  }

  async register(registerUserInput: RegisterUserInput): Promise<MessageDto> {
    // Implement logic to register a user
    return { message: 'User registered successfully', ok: true, statusCode: 201 };
  }

  async updatePassword(email: string, token: string, password: string): Promise<MessageDto> {
    // Implement logic to update password
    return { message: 'Password updated successfully', ok: true, statusCode: 200 };
  }

  async findUser(): Promise<MessageDto> {
    const user = await this.userModel.findOne().exec();
    return { userData: this.toUserDto(user), ok: true, statusCode: 200 };
  }

  async findUsers(): Promise<MessageDto> {
    const users = await this.userModel.find().exec();
    return { usersData: users.map(user => this.toUserDto(user)), ok: true, statusCode: 200 };
  }

  async findFoods(productName: string): Promise<MessageDto> {
    // Implement logic to find foods by product name
    return { message: 'Foods found', ok: true, statusCode: 200 };
  }

  async findRestaurants(username: string): Promise<MessageDto> {
    // Implement logic to find restaurants by username
    return { message: 'Restaurants found', ok: true, statusCode: 200 };
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
