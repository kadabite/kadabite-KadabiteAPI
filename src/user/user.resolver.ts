import { Resolver, Query, Mutation, Args, Context, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { MessageDto } from '@/user/dto/message.dto';
import { CreateUserInput } from '@/user/dto/create-user.input';
import { RegisterUserInput } from '@/user/dto/register-user.input';
import { UpdateUserInput } from '@/user/dto/update-user.input';
import { AuthGuard } from '@/auth/auth.guard';
import { FindFoodsInput } from '@/user/dto/find-foods.input';
import { UpdatePasswordInput } from '@/user/dto/update-password.input';
import { ForgotPasswordInput } from '@/user/dto/forgot-password.input';

@Resolver(() => MessageDto)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Mutation(() => MessageDto)
  createUser(@Args() createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Mutation(() => MessageDto)
  @UseGuards(AuthGuard)
  deleteUser(@Context() context) {
    const userId = context.req.user.sub;
    return this.userService.remove(userId);
  }

  @Mutation(() => MessageDto)
  forgotPassword(@Args() forgotPasswordInput: ForgotPasswordInput) {
    return this.userService.forgotPassword(forgotPasswordInput.email);
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
    @Args() registerUserInput: RegisterUserInput,
    @Context() context
  ) {
    const userId = context.req.user.sub;
    return this.userService.register(registerUserInput, userId);
  }

  @Mutation(() => MessageDto)
  updatePassword(@Args() updatePasswordInput: UpdatePasswordInput) {
    return this.userService.updatePassword(
      updatePasswordInput.email,
      updatePasswordInput.token,
      updatePasswordInput.password
    );
  }

  @Mutation(() => MessageDto)
  @UseGuards(AuthGuard)
  updateUser(
    @Args() updateUserInput: UpdateUserInput,
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
  findUsers(@Args('page', { type: () => Int }) page: number, @Args('limit', { type: () => Int }) limit: number) {
    return this.userService.findAll(page, limit);
  }

  @Query(() => MessageDto, { name: 'findFoods' })
  findFoods(
    @Args() productInfo: FindFoodsInput) {
    return this.userService.findFoods(productInfo.productName, productInfo.page, productInfo.limit);
  }
}