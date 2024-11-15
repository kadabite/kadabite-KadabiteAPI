import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { MessageDto } from './dto/message.dto';
import { CreateUserInput } from './dto/create-user.input';
import { RegisterUserInput } from './dto/register-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { ThirdPartyUserDto } from './dto/third-party-user.dto';

@Resolver(() => MessageDto)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => MessageDto)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Mutation(() => MessageDto)
  deleteUser() {
    const userId = 'asfwawf';
    return this.userService.delete(userId);
  }

  @Mutation(() => MessageDto)
  forgotPassword(@Args('email') email: string) {
    return this.userService.forgotPassword(email);
  }

  @Mutation(() => MessageDto)
  login(@Args('email') email: string, @Args('password') password: string) {
    return this.userService.login(email, password);
  }

  @Mutation(() => MessageDto)
  logout() {
    const userId = 'asqwer';
    return this.userService.logout(userId);
  }

  @Mutation(() => MessageDto)
  registerUser(@Args('registerUserInput') registerUserInput: RegisterUserInput) {
    const userId = 'fasfwearew';
    return this.userService.register(registerUserInput, userId);
  }

  @Mutation(() => MessageDto)
  updatePassword(@Args('email') email: string, @Args('token') token: string, @Args('password') password: string) {
    return this.userService.updatePassword(email, token, password);
  }

  @Mutation(() => MessageDto)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    const id = "60f3b3b3b3b3b3b3b3b3b3b3";
    return this.userService.update(id, updateUserInput);
  }

  @Query(() => MessageDto, { name: 'user' })
  findUser() {
    const userId = 'fasfwqree';
    return this.userService.findOne(userId);
  }

  @Query(() => MessageDto, { name: 'users' })
  findUsers() {
    return this.userService.findAll();
  }

  @Query(() => MessageDto, { name: 'findFoods' })
  findFoods(@Args('productName') productName: string) {
    const page = 4;
    const limit = 3;
    return this.userService.findFoods(productName, page, limit);
  }

  @Query(() => ThirdPartyUserDto, { name: 'thirdPartyUser' })
  findThirdPartyUser(@Args('username') username: string) {
    return this.userService.findThirdPartyUser(username);
  }
}