import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { OrderService } from '@/order/order.service';
import { OrderDto } from '@/order/dto/order.dto';
import { CreateOrderInput } from '@/order/dto/create-order.input';
import { DeleteOrderItemInput } from '@/order/dto/delete-order-item.input';
import { DeleteOrderInput } from '@/order/dto/delete-order.input';
import { DeleteOrderItemsNowInput } from '@/order/dto/delete-order-items-now.input';
import { UpdateOrderInput } from '@/order/dto/update-order.input';
import { UpdateOrderItemsInput } from '@/order/dto/update-order-items.input';

@Resolver(() => OrderDto)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation(() => OrderDto)
  createOrder(@Args('createOrderInput') createOrderInput: CreateOrderInput) {
    const userId = 'ffafwe';
    return this.orderService.create(createOrderInput, userId);
  }

  @Mutation(() => OrderDto)
  deleteAnOrderItem(@Args('deleteOrderItemInput') deleteOrderItemInput: DeleteOrderItemInput) {
    const userId = 'affr'
    return this.orderService.deleteOrderItem(deleteOrderItemInput.orderId, deleteOrderItemInput.orderItemId, userId);
  }

  @Mutation(() => OrderDto)
  deleteOrder(@Args('deleteOrderInput') deleteOrderInput: DeleteOrderInput) {
    const userId = 'fasfawer';
    return this.orderService.delete(deleteOrderInput.orderId, userId);
  }

  @Mutation(() => OrderDto)
  updateOrder(@Args('updateOrderInput') updateOrderInput: UpdateOrderInput) {
    const userId = 'asfw';
    return this.orderService.update(updateOrderInput, userId);
  }

  @Mutation(() => OrderDto)
  updateOrderItems(@Args('updateOrderItemsInput') updateOrderItemsInput: UpdateOrderItemsInput) {
    const userId = 'fasff';
    return this.orderService.updateOrderItems(updateOrderItemsInput.orderId, updateOrderItemsInput.orderItems, userId);
  }

  @Query(() => [OrderDto], { name: 'getAllOrders' })
  findAll() {
    const page = 4;
    const limit = 10
    return this.orderService.findAll(page, limit);
  }

  @Query(() => OrderDto, { name: 'getAnOrderItem' })
  findOne(@Args('orderItemId', { type: () => ID }) orderItemId: string) {
    return this.orderService.findOne(orderItemId);
  }

  @Query(() => [OrderDto], { name: 'getMyOrderItems' })
  findMyOrderItems(@Args('orderId', { type: () => ID }) orderId: string) {
    const userId = 'fasrge';
    return this.orderService.findMyOrderItems(userId, orderId);
  }

  @Query(() => [OrderDto], { name: 'getMyOrders' })
  findMyOrders() {
    const userId = 'fasfda';
    const page = 4;
    const limit = 3;
    return this.orderService.findMyOrders(userId, page, limit);
  }

  @Query(() => [OrderDto], { name: 'getTheOrderAsDispatcher' })
  findTheOrderAsDispatcher() {
    const userId = 'fasfas';
    const limit = 5;
    const page = 5;
    return this.orderService.findTheOrderAsDispatcher(userId, page, limit);
  }

  @Query(() => [OrderDto], { name: 'getTheOrderAsSeller' })
  findTheOrderAsSeller() {
    const userId = 'fasfas';
    const limit = 5;
    const page = 5;

    return this.orderService.findTheOrderAsSeller(userId, page, limit);
  }
}