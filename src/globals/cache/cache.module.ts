import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { Cache } from 'cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore as unknown as Cache,
        host: 'localhost',
        port: 6379,
        ttl: 600,
      }),
      inject: [ConfigService],
  }),
  ],
  exports: [CacheModule],
})
export class SharedCacheModule {}
