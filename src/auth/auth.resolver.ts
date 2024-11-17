import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MessageDto } from '@/user/dto/message.dto';
import { AuthService } from '@/auth/auth.service';

@Resolver(() => MessageDto)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Mutation(() => MessageDto)
  login(@Args('email') email: string, @Args('password') password: string) {
    return this.authService.signIn(email, password);
  }
}
