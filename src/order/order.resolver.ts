import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrderService } from '@/order/order.service';
import { OrderDto } from '@/order/dto/order.dto';
import { CreateOrderInput } from '@/order/dto/create-order.input';
import { DeleteOrderItemInput } from '@/order/dto/delete-order-item.input';
import { DeleteOrderInput } from '@/order/dto/delete-order.input';
import { UpdateOrderInput } from '@/order/dto/update-order.input';
import { UpdateOrderItemsInput } from '@/order/dto/update-order-items.input';
import { AuthGuard } from '@/auth/auth.guard';
import { MessageDto } from '@/user/dto/message.dto';

@Resolver(() => OrderDto)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation(() => OrderDto)
  @UseGuards(AuthGuard)
  createOrder(
    @Args() createOrderInput: CreateOrderInput,
    @Context() context
  ) {
    const userId = context.req.user.sub;
    return this.orderService.create(createOrderInput, userId);
  }

  @Mutation(() => OrderDto)
  @UseGuards(AuthGuard)
  deleteAnOrderItem(
    @Args() deleteOrderItemInput: DeleteOrderItemInput,
    @Context() context) {
    const userId = context.req.user.sub;
    return this.orderService.deleteOrderItem(
      deleteOrderItemInput.orderId,
      deleteOrderItemInput.orderItemId,
      userId);
  }

  @Mutation(() => OrderDto)
  @UseGuards(AuthGuard)
  deleteOrder(
    @Args() deleteOrderInput: DeleteOrderInput,
    @Context() context) {
    const userId = context.req.user.sub;
    return this.orderService.delete(deleteOrderInput.orderId, userId);
  }

  @Mutation(() => OrderDto)
  @UseGuards(AuthGuard)
  async updateOrder(
    @Args() updateOrderInput: UpdateOrderInput,
    @Context() context,
  ): Promise<MessageDto> {
    const userId = context.req.user.sub;
    return this.orderService.update(updateOrderInput, userId);
  }

  @Mutation(() => OrderDto)
  @UseGuards(AuthGuard)
  updateOrderItems(
    @Args() updateOrderItemsInput: UpdateOrderItemsInput,
    @Context() context
  ) {
    const userId = context.req.user.sub;
    return this.orderService.updateOrderItems(updateOrderItemsInput.orderId, updateOrderItemsInput.orderItems, userId);
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