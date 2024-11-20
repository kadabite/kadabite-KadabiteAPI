import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthResolver } from '@/auth/auth.resolver';
import { AuthService } from '@/auth/auth.service';
import { AuthGuard } from '@/auth/auth.guard';
import { UserModule } from '@/user/user.module';

@Module({
  providers: [AuthService, AuthResolver, AuthGuard, JwtService],
  imports: [
    MongooseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService]
    }),
    forwardRef(() => UserModule),
  ],
  exports: [AuthGuard, AuthService, AuthResolver, JwtService, MongooseModule],
})
export class AuthModule {}
