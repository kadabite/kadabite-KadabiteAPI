import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { OrderDocument } from '@/order/schemas/order.schema';
import { CreateOrderInput } from '@/order/dto/create-order.input';
import { UpdateOrderInput } from '@/order/dto/update-order.input';
import { UpdateOrderItemsInput } from '@/order/dto/update-order-items.input';

@Injectable()
export class OrderService {
  constructor(@InjectModel('Order') private orderModel: Model<OrderDocument>) {}

  create(createOrderInput: CreateOrderInput): Promise<OrderDocument> {
    const createdOrder = new this.orderModel(createOrderInput);
    return createdOrder.save();
  }

  deleteOrderItem(orderId: string, orderItemId: string): Promise<OrderDocument> {
    return this.orderModel.findByIdAndUpdate(orderId, { $pull: { orderItems: orderItemId } }, { new: true }).exec();
  }

  delete(orderId: string): Promise<OrderDocument> {
    return this.orderModel.findByIdAndDelete(orderId).exec();
  }

  deleteOrderItemsNow(ids: string[]): Promise<UpdateWriteOpResult> {
    return this.orderModel.updateMany({ _id: { $in: ids } }, { $pull: { orderItems: { $in: ids } } }).exec();
  }

  update(orderId: string, status: string): Promise<OrderDocument> {
    return this.orderModel.findByIdAndUpdate(orderId, { status }, { new: true }).exec();
  }

  updateOrderItems(orderId: string, orderItems: UpdateOrderItemsInput[]): Promise<OrderDocument> {
    return this.orderModel.findByIdAndUpdate(orderId, { orderItems }, { new: true }).exec();
  }

  findAll(): Promise<OrderDocument[]> {
    return this.orderModel.find().exec();
  }

  findOne(orderItemId: string): Promise<OrderDocument> {
    return this.orderModel.findOne({ 'orderItems._id': orderItemId }).exec();
  }

  findMyOrderItems(orderId: string): Promise<OrderDocument[]> {
    return this.orderModel.find({ _id: orderId }).exec();
  }

  findMyOrders(): Promise<OrderDocument[]> {
    return this.orderModel.find().exec();
  }

  findTheOrderAsDispatcher(): Promise<OrderDocument[]> {
    // Implement logic to find orders as dispatcher
    return this.orderModel.find().exec();
  }

  findTheOrderAsSeller(): Promise<OrderDocument[]> {
    // Implement logic to find orders as seller
    return this.orderModel.find().exec();
  }
}
