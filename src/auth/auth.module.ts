import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthResolver } from '@/auth/auth.resolver';
import { AuthService } from '@/auth/auth.service';
import { AuthGuard } from '@/auth/auth.guard';


@Module({
  providers: [AuthService, AuthResolver],
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
  ],
  exports: [AuthGuard]
})
export class AuthModule {}
