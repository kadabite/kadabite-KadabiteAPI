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
    return this.orderService.create(createOrderInput);
  }

  @Mutation(() => OrderDto)
  deleteAnOrderItem(@Args('deleteOrderItemInput') deleteOrderItemInput: DeleteOrderItemInput) {
    return this.orderService.deleteOrderItem(deleteOrderItemInput.orderId, deleteOrderItemInput.orderItemId);
  }

  @Mutation(() => OrderDto)
  deleteOrder(@Args('deleteOrderInput') deleteOrderInput: DeleteOrderInput) {
    return this.orderService.delete(deleteOrderInput.orderId);
  }

  @Mutation(() => OrderDto)
  deleteOrderItemsNow(@Args('deleteOrderItemsNowInput') deleteOrderItemsNowInput: DeleteOrderItemsNowInput) {
    return this.orderService.deleteOrderItemsNow(deleteOrderItemsNowInput.ids);
  }

  @Mutation(() => OrderDto)
  updateOrder(@Args('updateOrderInput') updateOrderInput: UpdateOrderInput) {
    return this.orderService.update(updateOrderInput.orderId, updateOrderInput.status);
  }

  @Mutation(() => OrderDto)
  updateOrderItems(@Args('updateOrderItemsInput') updateOrderItemsInput: UpdateOrderItemsInput) {
    return this.orderService.updateOrderItems(updateOrderItemsInput.orderId, updateOrderItemsInput.orderItems);
  }

  @Query(() => [OrderDto], { name: 'getAllOrders' })
  findAll() {
    return this.orderService.findAll();
  }

  @Query(() => OrderDto, { name: 'getAnOrderItem' })
  findOne(@Args('orderItemId', { type: () => ID }) orderItemId: string) {
    return this.orderService.findOne(orderItemId);
  }

  @Query(() => [OrderDto], { name: 'getMyOrderItems' })
  findMyOrderItems(@Args('orderId', { type: () => ID }) orderId: string) {
    return this.orderService.findMyOrderItems(orderId);
  }

  @Query(() => [OrderDto], { name: 'getMyOrders' })
  findMyOrders() {
    return this.orderService.findMyOrders();
  }

  @Query(() => [OrderDto], { name: 'getTheOrderAsDispatcher' })
  findTheOrderAsDispatcher() {
    return this.orderService.findTheOrderAsDispatcher();
  }

  @Query(() => [OrderDto], { name: 'getTheOrderAsSeller' })
  findTheOrderAsSeller() {
    return this.orderService.findTheOrderAsSeller();
  }
}