import { Module, forwardRef } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { UserResolver } from '@/user/user.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema, UserDocument } from '@/user/schemas/user.schema';
import { WaitList, WaitListSchema } from '@/user/schemas/waitlist.schema';
import * as bcrypt from 'bcrypt';
import { AuthModule } from '@/auth/auth.module';
import { LocationModule } from '@/location/location.module';
import { ProductModule } from '@/product/product.module';
import { Newsletter, NewsletterSchema } from '@/user/schemas/newsletter.schema';

@Module({
  providers: [UserResolver, UserService],
  imports: [
    MongooseModule.forFeatureAsync(
      [
        { 
          name: User.name,
          useFactory: async () => {
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
        },
        {
          name: WaitList.name,
          useFactory: () => WaitListSchema,
        },
        {
          name: Newsletter.name,
          useFactory: () => NewsletterSchema,
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
