import { Module } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { UserResolver } from '@/user/user.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema, UserDocument } from '@/user/schemas/user.schema';
import bcrypt from 'bcrypt';

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
  ],
  exports: [MongooseModule],
})
export class UserModule {}
