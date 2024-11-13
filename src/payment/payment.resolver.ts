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
    return this.paymentService.create(createPaymentInput);
  }

  @Mutation(() => PaymentDto)
  updatePayment(@Args('updatePaymentInput') updatePaymentInput: UpdatePaymentInput) {
    return this.paymentService.update(updatePaymentInput.paymentId, updatePaymentInput.status);
  }

  @Query(() => PaymentDto, { name: 'getMyPayment' })
  getMyPayment(@Args('orderId', { type: () => ID }) orderId: string) {
    return this.paymentService.getMyPayment(orderId);
  }
}