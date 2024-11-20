import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MessageDto } from '@/user/dto/message.dto';
import { UserNotFoundError } from '@/common/custom-errors/user/user-not-found.error';
import { InvalidCredentialsError } from '@/common/custom-errors/user/invalid-credentials.error';
import { UserDocument } from '@/user/schemas/user.schema';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
      @InjectModel('User') private userModel: Model<UserDocument>,
      @InjectConnection() private readonly connection: Connection,
      private jwtService: JwtService,
      private configService: ConfigService,
  ) {}

  async signIn(email: string, password: string): Promise<MessageDto> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      // Validate input
      if (email === '' || password === '') {
        throw new InvalidCredentialsError('Provide more information');
      }

      // Find the user based on the email and return error if the user does not exist
      const user = await this.userModel.findOne({ email }).session(session);
      if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        throw new InvalidCredentialsError('Invalid credentials');
      }

      const payload = { sub: user.id, role: user.role };
      // Generate JWT refresh token that expires in two days
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN')
      });

      // Update user information to be loggedIn
      await this.userModel.findByIdAndUpdate(user.id, { isLoggedIn: true }).session(session);

      // Generate JWT with user ID and expiration time
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET_KEY'),
        expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN')
      });

      await session.commitTransaction();
      return { token: accessToken, ok: true, statusCode: 200, refreshToken };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Error logging in user: ' + (error as Error).message);

      if (error instanceof UserNotFoundError || error instanceof InvalidCredentialsError) {
        return { message: error.message, statusCode: 401, ok: false };
      }

      return { message: 'An error occurred!', statusCode: 400, ok: false };
    } finally {
      session.endSession();
    }
  }

  async getNewAccessToken(refreshToken: string): Promise<MessageDto> {
    try {
      if (!refreshToken) {
        return { message: 'Refresh token is missing!', statusCode: 401, ok: false };
      }
      const verified = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
      });
      if (!verified) {
        return { message: 'Refresh token is invalid!', statusCode: 401, ok: false };
      }
      const user = await this.userModel.findById((verified as any).userId);
      if (!user) {
        return { message: 'User not found!', statusCode: 404, ok: false };
      }
      if (!user.isLoggedIn) {
        return { message: 'User is not logged in!', statusCode: 401, ok: false };
      }
      const accessToken = await this.jwtService.signAsync({ sub: user.id, role: user.role }, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET_KEY'),
        expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN'),
      });
      return { token: accessToken, ok: true, statusCode: 200 };
    } catch (error) {
      this.logger.error('Error getting new access token: ' + (error as Error).message);
      return { message: 'An error occurred!', statusCode: 500, ok: false };
    }
  }
}
