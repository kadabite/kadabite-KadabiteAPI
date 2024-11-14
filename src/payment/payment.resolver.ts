import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { PaymentService } from '@/payment/payment.service';
import { PaymentDto } from '@/payment/dto/payment.dto';
import { PaymentsDto } from '@/payment/dto/payments.dto';
import { CreatePaymentInput } from '@/payment/dto/create-payment.input';
import { UpdatePaymentInput } from '@/payment/dto/update-payment.input';

@Resolver(() => PaymentDto)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(() => PaymentDto)
  createPayment(@Args('createPaymentInput') createPaymentInput: CreatePaymentInput) {
    const userId = 'userId'; // Get userId from context
    return this.paymentService.createPayment(
      createPaymentInput.orderId,
      createPaymentInput.paymentMethod,
      createPaymentInput.currency,
      createPaymentInput.sellerAmount,
      createPaymentInput.dispatcherAmount,
      userId
    );
  }

  @Mutation(() => PaymentDto)
  updatePayment(@Args('updatePaymentInput') updatePaymentInput: UpdatePaymentInput) {
    const userId = 'userId'; // Get userId from context
    return this.paymentService.updatePayment(updatePaymentInput.paymentId, updatePaymentInput.status, userId);
  }

  @Query(() => PaymentDto, { name: 'getMyPayment' })
  getMyPayment(@Args('orderId', { type: () => ID }) orderId: string) {
    const userId = 'userId'; // Get userId from context
    return this.paymentService.getMyPayment(orderId, userId);
  }
}