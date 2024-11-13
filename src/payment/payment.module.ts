import { Module } from '@nestjs/common';
import { PaymentService } from '@/payment/payment.service';
import { PaymentResolver } from '@/payment/payment.resolver';
import { Payment, PaymentSchema } from '@/payment/schemas/payment.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  providers: [PaymentResolver, PaymentService],
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
  ],
  exports: [MongooseModule],
})
export class PaymentModule {}
