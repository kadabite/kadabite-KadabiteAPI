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
    return this.userService.delete();
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
    return this.userService.logout();
  }

  @Mutation(() => MessageDto)
  registerUser(@Args('registerUserInput') registerUserInput: RegisterUserInput) {
    return this.userService.register(registerUserInput);
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
    return this.userService.findUser();
  }

  @Query(() => MessageDto, { name: 'users' })
  findUsers() {
    return this.userService.findUsers();
  }

  @Query(() => MessageDto, { name: 'findFoods' })
  findFoods(@Args('productName') productName: string) {
    return this.userService.findFoods(productName);
  }

  @Query(() => MessageDto, { name: 'findRestaurants' })
  findRestaurants(@Args('username') username: string) {
    return this.userService.findRestaurants(username);
  }

  @Query(() => ThirdPartyUserDto, { name: 'thirdPartyUser' })
  findThirdPartyUser(@Args('username') username: string) {
    return this.userService.findThirdPartyUser(username);
  }
}