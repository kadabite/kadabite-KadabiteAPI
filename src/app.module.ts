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
import { Keyv } from 'keyv';
import KeyvRedis from '@keyv/redis';
import { createCache } from 'cache-manager';
import { CacheableMemory } from 'cacheable';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const memoryStore = new Keyv({
          store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
        });

        const redisStore = new Keyv({
          store: new KeyvRedis(configService.get<string>('REDIS_URL')),
        });

        const cache = createCache({
          stores: [memoryStore, redisStore],
          ttl: configService.get<number>('CACHE_TTL'),
          refreshThreshold: 3000,
        });

        return {
          store: cache as unknown as CacheStore,
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
    ConfigModule.forRoot({
      isGlobal: true,
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
        uri: configService.get('MONGODB_URI'),
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