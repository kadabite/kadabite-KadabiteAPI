import { Injectable, Logger } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Model } from 'mongoose';
import { PaymentDocument, PaymentMethod } from '@/payment/schemas/payment.schema';
import { OrderDocument } from '@/order/schemas/order.schema';
import { MessageDto } from '@/user/dto/message.dto';
import { UnauthorizedError } from '@/common/custom-errors/auth/unauthorized.error';
import { OrderNotFoundError } from '@/common/custom-errors/order/order-not-found.error';
import { PaymentNotFoundError } from '@/common/custom-errors/payment/payment-not-found.error';
import { InvalidPaymentMethodError, InvalidCurrencyError, InvalidAmountError } from '@/common/custom-errors/payment/payment-errors.error';
import { paymentMethods } from '@/payment/schemas/payment.schema';
import { UpdatePaymentInput } from '@/payment/dto/update-payment.input';
import { CreatePaymentInput } from '@/payment/dto/create-payment.input';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectModel('Payment') private paymentModel: Model<PaymentDocument>,
    @InjectModel('Order') private orderModel: Model<OrderDocument>,
    @InjectConnection() private readonly connection: Connection

  ) {}

  async createPayment(createPaymentInput: CreatePaymentInput, userId: string): Promise<MessageDto> {
    const { orderId, paymentMethod, currency, sellerAmount, dispatcherAmount } = createPaymentInput;
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      // Find order
      const order = await this.orderModel.findById(orderId).session(session);
      if (!order) {
        throw new OrderNotFoundError('Order not found');
      }

      // Check if the user is authorized to create the payment
      if (order.buyerId.toString() !== userId) {
        throw new UnauthorizedError('Unauthorized');
      }

      // Validate payment method
      if (!paymentMethods.includes(paymentMethod as PaymentMethod)) {
        throw new InvalidPaymentMethodError('Payment method is not allowed');
      }

      // Validate currency
      const availableCurrency = ['USD', 'EUR']; // Replace with actual available currencies
      if (!availableCurrency.includes(currency)) {
        throw new InvalidCurrencyError('Currency not available for transaction');
      }

      // Validate amounts
      if (sellerAmount < 0 || dispatcherAmount < 0) {
        throw new InvalidAmountError('Invalid amount');
      }

      // Create payment
      const payment = new this.paymentModel({
        orderId,
        paymentMethod,
        currency,
        sellerAmount,
        dispatcherAmount
      });
      await payment.save({ session });

      // Update order
      order.payment.push(payment.id);
      await order.save({ session });

      await session.commitTransaction();
      return { message: 'Payment was successfully created!', id: payment.id.toString(), statusCode: 201, ok: true };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Error creating payment: ' + (error as Error).message);

      if (error instanceof OrderNotFoundError || error instanceof UnauthorizedError || error instanceof InvalidPaymentMethodError || error instanceof InvalidCurrencyError || error instanceof InvalidAmountError) {
        return { message: error.message, statusCode: 400, ok: false };
      }

      return { message: 'An error occurred while processing payment', statusCode: 500, ok: false };
    } finally {
      session.endSession();
    }
  }

  async updatePayment(updatePaymentInput: UpdatePaymentInput, userId: string): Promise<MessageDto> {
    const { paymentId, status } = updatePaymentInput;
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      // Find payment
      const payment = await this.paymentModel.findById(paymentId).session(session);
      if (!payment) {
        throw new PaymentNotFoundError('Payment not found');
      }

      // Find order
      const order = await this.orderModel.findById(payment.orderId).session(session);
      if (!order) {
        throw new OrderNotFoundError('Order not found');
      }

      // Check if the user is authorized to update the payment
      if (order.sellerId.toString() === userId) {
        payment.sellerPaymentStatus = status;
      } else if (order.dispatcherId.toString() === userId) {
        payment.dispatcherPaymentStatus = status;
      } else {
        throw new UnauthorizedError('Unauthorized');
      }

      payment.lastUpdateTime = new Date();
      payment.paymentDateTime = new Date();

      if (payment.sellerPaymentStatus === 'paid' && payment.dispatcherPaymentStatus === 'paid') {
        order.status = 'completed';
      } else {
        order.status = 'incomplete';
      }

      await order.save({ session });
      await payment.save({ session });

      await session.commitTransaction();
      return { message: 'Payment was successfully updated!', id: payment.id.toString(), statusCode: 200, ok: true };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Error updating payment: ' + (error as Error).message);

      if (error instanceof PaymentNotFoundError || error instanceof OrderNotFoundError || error instanceof UnauthorizedError) {
        return { message: error.message, statusCode: 400, ok: false };
      }

      return { message: 'An error occurred while processing payment', statusCode: 500, ok: false };
    } finally {
      session.endSession();
    }
  }

  async getMyPayment(orderId: string, userId: string): Promise<MessageDto> {
    try {
      // Find order
      const order = await this.orderModel.findById(orderId).populate<{ payment: PaymentDocument[] }>('payment').exec();
      if (!order) {
        throw new OrderNotFoundError('Order was not found!');
      }

      // Check if the user is authorized to view the payment
      if (!(order.buyerId.toString() === userId ||
        order.sellerId.toString() === userId ||
        order.dispatcherId.toString() === userId)) {
        throw new UnauthorizedError('You may not be the right user!');
      }

      return { paymentsData: order.payment, statusCode: 200, ok: true };
    } catch (error) {
      this.logger.error('Error getting payment: ' + (error as Error).message);

      if (error instanceof OrderNotFoundError || error instanceof UnauthorizedError) {
        return { message: error.message, statusCode: 401, ok: false };
      }

      return { message: 'An error occurred!', statusCode: 500, ok: false };
    }
  }
}