import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PaymentService } from '@/payment/payment.service';
import { PaymentDto } from '@/payment/dto/payment.dto';
import { PaymentsDto } from '@/payment/dto/payments.dto';
import { CreatePaymentInput } from '@/payment/dto/create-payment.input';
import { UpdatePaymentInput } from '@/payment/dto/update-payment.input';
import { AuthGuard } from '@/auth/auth.guard';

@Resolver(() => PaymentDto)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(() => PaymentDto)
  @UseGuards(AuthGuard)
  createPayment(
    @Args() createPaymentInput: CreatePaymentInput,
    @Context() context
  ) {
    const userId = context.req.user.sub;
    return this.paymentService.createPayment(createPaymentInput, userId);
  }

  @Mutation(() => PaymentDto)
  @UseGuards(AuthGuard)
  updatePayment(
    @Args() updatePaymentInput: UpdatePaymentInput,
    @Context() context
  ) {
    const userId = context.req.user.sub;
    return this.paymentService.updatePayment(updatePaymentInput, userId);
  }

  @Query(() => PaymentDto, { name: 'getMyPayment' })
  @UseGuards(AuthGuard)
  getMyPayment(@Args('orderId', { type: () => ID }) orderId: string, @Context() context) {
    const userId = context.req.user.sub;
    return this.paymentService.getMyPayment(orderId, userId);
  }
}