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
import { NewsletterInput } from './dto/newsletter.dto';
import { WaitListInput } from './dto/waitlist.dto';

@Resolver(() => MessageDto)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Mutation(() => MessageDto, { description: 'Create a new user' })
  createUser(@Args() createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Mutation(() => MessageDto, { description: 'Delete an existing user' })
  @UseGuards(AuthGuard)
  deleteUser(@Context() context) {
    const userId = context.req.user.sub;
    return this.userService.remove(userId);
  }

  @Mutation(() => MessageDto, { description: 'Initiate forgot password process' })
  forgotPassword(@Args() forgotPasswordInput: ForgotPasswordInput) {
    return this.userService.forgotPassword(forgotPasswordInput.email);
  }

  @Mutation(() => MessageDto, { description: 'Logout the current user' })
  @UseGuards(AuthGuard)
  logout(@Context() context) {
    const userId = context.req.user.sub;
    return this.userService.logout(userId);
  }

  @Mutation(() => MessageDto, { description: 'add user to recieve newletter', name: 'newsletter' })
  addUserToNewsletter(
    @Args() newsletterInput: NewsletterInput,
    @Context() context
  ) {
    const userId = context.req?.user?.sub;
    return this.userService.addUserToNewsletter(newsletterInput, userId);
  }

  @Mutation(() => MessageDto, { description: 'add user to waitlist', name: 'waitlist' })
  addUserToWaitlist(
    @Args() waitlist: WaitListInput,
  ) {
    return this.userService.addUserToWaitList(waitlist);
  }

  @Mutation(() => MessageDto, {
    description: 'Remove user from recieving newsletter',
    name: 'unsubcribeNewsletter'
  })
  removeUserFromNewsletter(
    @Args() remNewslettersub: NewsletterInput,
  ) {
    const { email, emailToken } = remNewslettersub;
    return this.userService.removeUserFromNewsletter(email, emailToken);
  }

  @Mutation(() => MessageDto, { description: 'Register a new user' })
  @UseGuards(AuthGuard)
  registerUser(
    @Args() registerUserInput: RegisterUserInput,
    @Context() context
  ) {
    const userId = context.req.user.sub;
    return this.userService.register(registerUserInput, userId);
  }

  @Mutation(() => MessageDto, { description: 'Update user password' })
  updatePassword(@Args() updatePasswordInput: UpdatePasswordInput) {
    return this.userService.updatePassword(
      updatePasswordInput.email,
      updatePasswordInput.token,
      updatePasswordInput.password
    );
  }

  @Mutation(() => MessageDto, { description: 'Update user information' })
  @UseGuards(AuthGuard)
  updateUser(
    @Args() updateUserInput: UpdateUserInput,
    @Context() context
  ) {
    const userId = context.req.user.sub;
    return this.userService.update(userId, updateUserInput);
  }

  @Query(() => MessageDto, { name: 'getWaitList', description: 'Get a list of all users in wait list' })
  getWaitList() {
    return this.userService.getWaitList();
  }

  @Query(() => MessageDto, { name: 'user', description: 'Find a user by ID' })
  @UseGuards(AuthGuard)
  findUser(@Context() context) {
    const userId = context.req.user.sub;
    return this.userService.findOne(userId);
  }

  @Query(() => MessageDto, { name: 'users', description: 'Find all users with pagination' })
  @UseGuards(AuthGuard)
  findUsers(@Args('page', { type: () => Int }) page: number, @Args('limit', { type: () => Int }) limit: number) {
    if (page <= 0) {
      page = 1;
    }
    return this.userService.findAll(page, limit);
  }

  @Query(() => MessageDto, { name: 'findFoods', description: 'Find foods based on product information' })
  findFoods(
    @Args() productInfo: FindFoodsInput) {
    return this.userService.findFoods(productInfo.productName, productInfo.page, productInfo.limit);
  }
}