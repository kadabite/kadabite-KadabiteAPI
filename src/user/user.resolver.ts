import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { MessageDto } from '@/user/dto/message.dto';
import { CreateUserInput } from '@/user/dto/create-user.input';
import { RegisterUserInput } from '@/user/dto/register-user.input';
import { UpdateUserInput } from '@/user/dto/update-user.input';
import { AuthService } from '@/auth/auth.service';
import { AuthGuard } from '@/auth/auth.guard';

@Resolver(() => MessageDto)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Mutation(() => MessageDto)
  createUser(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('phoneNumber', { nullable: true }) phoneNumber: string
  ) {
    return this.userService.create({ email, password, phoneNumber });
  }

  @Mutation(() => MessageDto)
  @UseGuards(AuthGuard)
  deleteUser(@Context() context) {
    const userId = context.req.user.sub;
    return this.userService.remove(userId);
  }

  @Mutation(() => MessageDto)
  forgotPassword(@Args('email') email: string) {
    return this.userService.forgotPassword(email);
  }

  @Mutation(() => MessageDto)
  @UseGuards(AuthGuard)
  logout(@Context() context) {
    const userId = context.req.user.sub;
    return this.userService.logout(userId);
  }

  @Mutation(() => MessageDto)
  @UseGuards(AuthGuard)
  registerUser(
    @Args('registerUserInput') registerUserInput: RegisterUserInput,
    @Context() context
  ) {
    const userId = context.req.user.sub;
    return this.userService.register(registerUserInput, userId);
  }

  @Mutation(() => MessageDto)
  updatePassword(
    @Args('email') email: string,
    @Args('token') token: string,
    @Args('password') password: string
  ) {
    return this.userService.updatePassword(email, token, password);
  }

  @Mutation(() => MessageDto)
  @UseGuards(AuthGuard)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @Context() context
  ) {
    const userId = context.req.user.sub;
    return this.userService.update(userId, updateUserInput);
  }

  @Query(() => MessageDto, { name: 'user' })
  @UseGuards(AuthGuard)
  findUser(@Context() context) {
    const userId = context.req.user.sub;
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
}