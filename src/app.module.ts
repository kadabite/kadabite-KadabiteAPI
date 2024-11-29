import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '@/user/user.module';
import { ProductModule } from '@/product/product.module';
import { PaymentModule } from '@/payment/payment.module';
import { OrderModule } from '@/order/order.module';
import { LocationModule } from '@/location/location.module';
import { CategoryModule } from '@/category/category.module';
import { AuthModule } from '@/auth/auth.module';
import { CsrfMiddleware } from '@/common/middleware/csrf.middleware';
import { RefererOriginMiddleware } from '@/common/middleware/referrer-origin.middleware';
import { GlobalsModule } from '@/globals/globals.module';
import * as cookieParser from 'cookie-parser';

@Module({
  imports: [
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
      playground: process.env.NODE_ENV !== 'production',
      introspection: process.env.NODE_ENV !== 'production',
      // plugins: [ApolloServerPluginLandingPageLocalDefault()],
      include: [UserModule, ProductModule, PaymentModule, OrderModule, LocationModule, CategoryModule],
    }),
    UserModule,
    ProductModule,
    PaymentModule,
    OrderModule,
    LocationModule,
    CategoryModule,
    AuthModule,
    GlobalsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply()
      .forRoutes('*');
  }
}
