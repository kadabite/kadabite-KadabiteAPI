import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '@/user/user.module';
import { ProductModule } from '@/product/product.module';
import { PaymentModule } from '@/payment/payment.module';
import { OrderModule } from '@/order/order.module';
import { LocationModule } from '@/location/location.module';
import { CategoryModule } from '@/category/category.module';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bullmq';
import KeyvRedis from '@keyv/redis';
import Keyv from 'keyv';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');
        const redisStore = new Keyv({ store: new KeyvRedis(redisUrl) });

        return {
          store: redisStore as unknown as CacheStore, // Cast to CacheStore
          ttl: configService.get<number>('CACHE_TTL'),
        };
      },
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
      },
      playground: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      include: [UserModule, ProductModule, PaymentModule, OrderModule, LocationModule, CategoryModule],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ProductModule,
    PaymentModule,
    OrderModule,
    LocationModule,
    CategoryModule,
  ],
})
export class AppModule {}
