import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MessageDto } from '@/user/dto/message.dto';
import { AuthService } from '@/auth/auth.service';
import { LoginInput } from '@/auth/dto/login.input';

@Resolver(() => MessageDto)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Mutation(() => MessageDto)
  login(@Args('loginInput') loginInput: LoginInput) {
    const { email, password } = loginInput;
    return this.authService.signIn(email, password);
  }
}
