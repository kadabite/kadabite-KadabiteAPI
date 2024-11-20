import { Module, forwardRef } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { UserResolver } from '@/user/user.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema, UserDocument } from '@/user/schemas/user.schema';
import bcrypt from 'bcrypt';
import { AuthModule } from '@/auth/auth.module';
import { LocationModule } from '@/location/location.module';
import { ProductModule } from '@/product/product.module';

@Module({
  providers: [UserResolver, UserService],
  imports: [
    MongooseModule.forFeatureAsync(
      [
        { 
          name: User.name,
          useFactory: () => {
            const schema = UserSchema;
            schema.pre('save', async function () {
              const user = this as UserDocument;
              const salt = await bcrypt.genSalt();
              if (user.isModified('passwordHash')) {
                user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
              }
            });
            return schema;
          }
        }
      ]),
    forwardRef(() => AuthModule),
    forwardRef(() => LocationModule),
    forwardRef(() => ProductModule),
  ],
  exports: [
    MongooseModule,
    UserService,
    UserResolver,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
})
export class UserModule {}
