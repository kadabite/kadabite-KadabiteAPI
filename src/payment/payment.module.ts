import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentResolver } from './payment.resolver';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  providers: [PaymentResolver, PaymentService],
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
  ],
})
export class PaymentModule {}
