import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentDocument } from '@/payment/schemas/payment.schema';
import { CreatePaymentInput } from '@/payment/dto/create-payment.input';
import { UpdatePaymentInput } from '@/payment/dto/update-payment.input';

@Injectable()
export class PaymentService {
  constructor(@InjectModel('Payment') private paymentModel: Model<PaymentDocument>) {}

  create(createPaymentInput: CreatePaymentInput): Promise<PaymentDocument> {
    const createdPayment = new this.paymentModel(createPaymentInput);
    return createdPayment.save();
  }

  update(paymentId: string, status: string): Promise<PaymentDocument> {
    return this.paymentModel.findByIdAndUpdate(paymentId, { paymentStatus: status }, { new: true }).exec();
  }

  getMyPayment(orderId: string): Promise<PaymentDocument> {
    return this.paymentModel.findOne({ orderId }).exec();
  }
}