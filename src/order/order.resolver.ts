import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrderService } from '@/order/order.service';
import { OrderDto } from '@/order/dto/order.dto';
import { CreateOrderInput } from '@/order/dto/create-order.input';
import { DeleteOrderItemInput } from '@/order/dto/delete-order-item.input';
import { DeleteOrderInput } from '@/order/dto/delete-order.input';
import { DeleteOrderItemsNowInput } from '@/order/dto/delete-order-items-now.input';
import { UpdateOrderInput } from '@/order/dto/update-order.input';
import { UpdateOrderItemsInput } from '@/order/dto/update-order-items.input';
import { AuthGuard } from '@/auth/auth.guard';
import { OrderItemsInput } from '@/order/dto/order-items.input';
import { OrderItem2Input } from '@/order/dto/order-item2.input';
import { MessageDto } from '@/user/dto/message.dto';

@Resolver(() => OrderDto)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation(() => OrderDto)
  @UseGuards(AuthGuard)
  createOrder(
    @Args('sellerId') sellerId: string,
    @Args('dispatcherId', { nullable: true }) dispatcherId: string,
    @Args('deliveryAddress') deliveryAddress: string,
    @Args('orderItems') orderItems: OrderItemsInput[],
    @Context() context
  ) {
    const userId = context.req.user.sub;
    return this.orderService.create({ sellerId, dispatcherId, deliveryAddress, orderItems }, userId);
  }

  @Mutation(() => OrderDto)
  @UseGuards(AuthGuard)
  deleteAnOrderItem(
    @Args('orderId', { type: () => ID }) orderId: string, 
    @Args('orderItemId', { type: () => ID }) orderItemId: string,
    @Context() context) {
    const userId = context.req.user.sub;
    return this.orderService.deleteOrderItem(orderId, orderItemId, userId);
  }

  @Mutation(() => OrderDto)
  @UseGuards(AuthGuard)
  deleteOrder(
    @Args('orderId') orderId: string,
    @Context() context) {
    const userId = context.req.user.sub;
    return this.orderService.delete(orderId, userId);
  }

  @Mutation(() => OrderDto)
  @UseGuards(AuthGuard)
  async updateOrder(
    @Args('orderId') orderId: string,
    @Context() context,
    @Args('deliveryAddress', { nullable: true }) deliveryAddress?: string,
    @Args('receivedByBuyer', { nullable: true }) recievedByBuyer?: boolean,
    @Args('deliveredByDispatcher', { nullable: true }) deliveredByDispatcher?: boolean,
  ): Promise<MessageDto> {
    const userId = context.req.user.sub;
    return this.orderService.update({ orderId, deliveryAddress, recievedByBuyer, deliveredByDispatcher }, userId);
  }

  @Mutation(() => OrderDto)
  @UseGuards(AuthGuard)
  updateOrderItems(
    @Args('orderId') orderId: string,
    @Args('orderItems') orderItems: OrderItem2Input[],
    @Context() context
  ) {
    const userId = context.req.user.sub;
    return this.orderService.updateOrderItems(orderId, orderItems, userId);
  }

  @Query(() => [OrderDto], { name: 'getAllOrders' })
  findAll(@Args('page', { type: () => Number, nullable: true }) page: number = 1, @Args('limit', { type: () => Number, nullable: true }) limit: number = 10) {
    return this.orderService.findAll(page, limit);
  }

  @Query(() => OrderDto, { name: 'getAnOrderItem' })
  findOne(@Args('orderItemId', { type: () => ID }) orderItemId: string) {
    return this.orderService.findOne(orderItemId);
  }

  @Query(() => [OrderDto], { name: 'getMyOrderItems' })
  @UseGuards(AuthGuard)
  findMyOrderItems(@Args('orderId', { type: () => ID }) orderId: string, @Context() context) {
    const userId = context.req.user.sub;
    return this.orderService.findMyOrderItems(userId, orderId);
  }

  @Query(() => [OrderDto], { name: 'getMyOrders' })
  @UseGuards(AuthGuard)
  findMyOrders(@Context() context, @Args('page', { type: () => Number, nullable: true }) page: number = 1, @Args('limit', { type: () => Number, nullable: true }) limit: number = 10) {
    const userId = context.req.user.sub;
    return this.orderService.findMyOrders(userId, page, limit);
  }

  @Query(() => [OrderDto], { name: 'getTheOrderAsDispatcher' })
  @UseGuards(AuthGuard)
  findTheOrderAsDispatcher(@Context() context, @Args('page', { type: () => Number, nullable: true }) page: number = 1, @Args('limit', { type: () => Number, nullable: true }) limit: number = 10) {
    const userId = context.req.user.sub;
    return this.orderService.findTheOrderAsDispatcher(userId, page, limit);
  }

  @Query(() => [OrderDto], { name: 'getTheOrderAsSeller' })
  @UseGuards(AuthGuard)
  findTheOrderAsSeller(@Context() context, @Args('page', { type: () => Number, nullable: true }) page: number = 1, @Args('limit', { type: () => Number, nullable: true }) limit: number = 10) {
    const userId = context.req.user.sub;
    return this.orderService.findTheOrderAsSeller(userId, page, limit);
  }
}