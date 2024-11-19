import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisClient = createClient({
          url: `redis://${configService.get<string>('REDIS_HOST', 'localhost')}:${configService.get<number>('REDIS_PORT', 6379)}`,
        });

        await redisClient.connect(); // Ensure the Redis client connects before being used

        return {
          store: {
            create: () => ({
              get: async (key: string) => {
                const value = await redisClient.get(key);
                return value ? JSON.parse(value) : null;
              },
              set: async (key: string, value: any, options?: { ttl: number }) => {
                const ttl = options?.ttl || 600; // Default TTL of 600 seconds
                await redisClient.set(key, JSON.stringify(value), { EX: ttl });
              },
              del: async (key: string) => {
                await redisClient.del(key);
              },
            }),
          },
          ttl: 600,
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [CacheModule],
})
export class SharedCacheModule {}
