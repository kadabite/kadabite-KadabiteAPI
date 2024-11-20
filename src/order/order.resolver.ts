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

  @Mutation(() => OrderDto, { description: 'Create a new order' })
  @UseGuards(AuthGuard)
  createOrder(
    @Args() createOrderInput: CreateOrderInput,
    @Context() context
  ) {
    const userId = context.req.user.sub;
    return this.orderService.create(createOrderInput, userId);
  }

  @Mutation(() => OrderDto, { description: 'Delete an item from an order' })
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

  @Mutation(() => OrderDto, { description: 'Delete an order' })
  @UseGuards(AuthGuard)
  deleteOrder(
    @Args() deleteOrderInput: DeleteOrderInput,
    @Context() context) {
    const userId = context.req.user.sub;
    return this.orderService.delete(deleteOrderInput.orderId, userId);
  }

  @Mutation(() => OrderDto, { description: 'Update an existing order' })
  @UseGuards(AuthGuard)
  async updateOrder(
    @Args() updateOrderInput: UpdateOrderInput,
    @Context() context,
  ): Promise<MessageDto> {
    const userId = context.req.user.sub;
    return this.orderService.update(updateOrderInput, userId);
  }

  @Mutation(() => OrderDto, { description: 'Update items in an order' })
  @UseGuards(AuthGuard)
  updateOrderItems(
    @Args() updateOrderItemsInput: UpdateOrderItemsInput,
    @Context() context
  ) {
    const userId = context.req.user.sub;
    return this.orderService.updateOrderItems(updateOrderItemsInput.orderId, updateOrderItemsInput.orderItems, userId);
  }

  @Query(() => [OrderDto], { name: 'getAllOrders', description: 'Get all orders with pagination' })
  findAll(@Args('page', { type: () => Number, nullable: true }) page: number = 1, @Args('limit', { type: () => Number, nullable: true }) limit: number = 10) {
    return this.orderService.findAll(page, limit);
  }

  @Query(() => OrderDto, { name: 'getAnOrderItem', description: 'Get details of a specific order item' })
  findOne(@Args('orderItemId', { type: () => ID }) orderItemId: string) {
    return this.orderService.findOne(orderItemId);
  }

  @Query(() => [OrderDto], { name: 'getMyOrderItems', description: 'Get all items of a specific order for the current user' })
  @UseGuards(AuthGuard)
  findMyOrderItems(@Args('orderId', { type: () => ID }) orderId: string, @Context() context) {
    const userId = context.req.user.sub;
    return this.orderService.findMyOrderItems(userId, orderId);
  }

  @Query(() => [OrderDto], { name: 'getMyOrders', description: 'Get all orders of the current user with pagination' })
  @UseGuards(AuthGuard)
  findMyOrders(@Context() context, @Args('page', { type: () => Number, nullable: true }) page: number = 1, @Args('limit', { type: () => Number, nullable: true }) limit: number = 10) {
    const userId = context.req.user.sub;
    return this.orderService.findMyOrders(userId, page, limit);
  }

  @Query(() => [OrderDto], { name: 'getTheOrderAsDispatcher', description: 'Get orders assigned to the current user as dispatcher with pagination' })
  @UseGuards(AuthGuard)
  findTheOrderAsDispatcher(@Context() context, @Args('page', { type: () => Number, nullable: true }) page: number = 1, @Args('limit', { type: () => Number, nullable: true }) limit: number = 10) {
    const userId = context.req.user.sub;
    return this.orderService.findTheOrderAsDispatcher(userId, page, limit);
  }

  @Query(() => [OrderDto], { name: 'getTheOrderAsSeller', description: 'Get orders assigned to the current user as seller with pagination' })
  @UseGuards(AuthGuard)
  findTheOrderAsSeller(@Context() context, @Args('page', { type: () => Number, nullable: true }) page: number = 1, @Args('limit', { type: () => Number, nullable: true }) limit: number = 10) {
    const userId = context.req.user.sub;
    return this.orderService.findTheOrderAsSeller(userId, page, limit);
  }
}