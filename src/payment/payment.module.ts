import { Module, forwardRef } from '@nestjs/common';
import { PaymentService } from '@/payment/payment.service';
import { PaymentResolver } from '@/payment/payment.resolver';
import { Payment, PaymentSchema } from '@/payment/schemas/payment.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderModule } from '@/order/order.module';
import { UserModule } from '@/user/user.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
  providers: [PaymentResolver, PaymentService],
  imports: [
    OrderModule,
    AuthModule,
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    forwardRef(() => UserModule),
  ],
  exports: [MongooseModule, PaymentService, PaymentResolver, MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }])],
})
export class PaymentModule {}
