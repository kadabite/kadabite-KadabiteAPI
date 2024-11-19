import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { OrderDocument, OrderItemDocument } from '@/order/schemas/order.schema';
import { MessageDto } from '@/user/dto/message.dto';
import { UnauthorizedError } from '@/common/custom-errors/auth/unauthorized.error';
import { OrderDto } from '@/order/dto/order.dto';
import { UserNotFoundError } from '@/common/custom-errors/user/user-not-found.error';
import { OrderNotFoundError } from '@/common/custom-errors/order/order-not-found.error';
import { InvalidInputError } from '@/common/custom-errors/user/invalid-credentials.error';
import { ProductNotFoundError } from '@/common/custom-errors/user/product-not-found.error';
import { OrderItem2Input } from '@/order/dto/order-item2.input';
import { PaymentDocument } from '@/payment/schemas/payment.schema';
import { UpdateOrderInput } from '@/order/dto/update-order.input';
import { ProductDocument } from '@/product/schemas/product.schema';
import { UserDocument } from '@/user/schemas/user.schema';
import { CreateOrderInput } from '@/order/dto/create-order.input';
import _ from 'lodash';
import { Cache } from 'cache-manager';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectModel('Order') private orderModel: Model<OrderDocument>,
    @InjectModel('OrderItem') private orderItemModel: Model<OrderItemDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel('User') private userModel: Model<UserDocument>,
    @InjectModel('Product') private productModel: Model<ProductDocument>,
    @InjectConnection() private readonly connection: Connection
  ) {}

  async create(createOrderInput: CreateOrderInput, userId: string): Promise<MessageDto> {
    const session = await this.connection.startSession();
    session.startTransaction();
    let createdItems = [];
    try {
      const { sellerId, dispatcherId, deliveryAddress, orderItems } = createOrderInput;
      const buyerId = userId;

      // Verify if the seller exists
      const seller = await this.userModel.findById(sellerId).session(session);
      if (!seller) {
        throw new UserNotFoundError('Seller does not exist');
      }

      // Verify if the dispatcher exists and is available
      if (dispatcherId) {
        const dispatcher = await this.userModel.findById(dispatcherId).session(session);
        if (!dispatcher) {
          throw new UserNotFoundError('Dispatcher does not exist');
        }
        if (dispatcher.dispatcherStatus !== 'available') {
          throw new UnauthorizedError('Dispatcher is not available');
        }
      }

      let currency: string;
      let totalAmount = 0;

      // Create each item one by one
      for (const data of orderItems) {
        // Verify if the product exists
        const product = await this.productModel.findById(data.productId).session(session);
        if (!product) {
          throw new ProductNotFoundError('Product does not exist');
        }

        // Get currency
        currency = product.currency;

        // Calculate total amount
        if (!data.quantity) data.quantity = 1;
        totalAmount += product.price * data.quantity;

        const item = new this.orderItemModel(data);
        await item.save({ session });
        createdItems.push(item.id);
      }

      // Create the order
      const newOrder = new this.orderModel({
        sellerId,
        dispatcherId,
        buyerId,
        deliveryAddress: _.trim(deliveryAddress),
        currency,
        totalAmount,
        orderItems: createdItems,
      });
      await newOrder.save({ session });

      await session.commitTransaction();
      return { message: 'Order was created successfully!', id: newOrder._id.toString(), statusCode: 201, ok: true };
    } catch (error) {
      await session.abortTransaction();
      if (createdItems.length > 0) {
        await this.orderItemModel.deleteMany({ _id: { $in: createdItems } }).session(session);
      }
      this.logger.error('Error creating orders: ' + (error as Error).message);

      if (error instanceof UserNotFoundError || error instanceof ProductNotFoundError || error instanceof UnauthorizedError || error instanceof InvalidInputError) {
        return { message: error.message, statusCode: 400, ok: false };
      }

      return { message: 'An error occurred!', statusCode: 500, ok: false };
    } finally {
      session.endSession();
    }
  }

  async deleteOrderItem(orderId: string, orderItemId: string, userId: string): Promise<MessageDto> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      // Find order and validate user
      const order = await this.orderModel.findById(orderId).populate<{ payment: PaymentDocument[] }>('payment').session(session);
      if (!order) {
        throw new OrderNotFoundError('Order does not exist');
      }
      if (!(order.buyerId.toString() === userId || order.sellerId.toString() === userId)) {
        throw new UnauthorizedError('You are not authorized to delete this order item');
      }

      if (order.payment && order.payment.length > 0) {
        if (order.payment[0].sellerPaymentStatus === 'paid' || order.payment[0].dispatcherPaymentStatus === 'paid') {
          throw new UnauthorizedError('You cannot delete a paid order\'s item');
        }
        if (order.payment[0].sellerPaymentStatus === 'inprocess' || order.payment[0].dispatcherPaymentStatus === 'inprocess') {
          const lastUpdateTime = new Date(order.payment[0].lastUpdateTime);
          const currentTime = new Date();
          const oneHourAgo = new Date(currentTime.getTime() - 3600000);
          if (oneHourAgo < lastUpdateTime) {
            throw new UnauthorizedError('You cannot delete an order item that is in process');
          }
        }
      }

      const index = order.orderItems.map(item => item.toString()).indexOf(orderItemId);
      if (index === -1) {
        throw new OrderNotFoundError('Order item does not exist');
      }
      order.orderItems.splice(index, 1);

      // Delete the order item
      await this.orderItemModel.findByIdAndDelete(orderItemId).session(session);

      // Save the order to update the total amount
      await order.save({ session });

      await session.commitTransaction();
      return { message: 'Order item was deleted successfully!', statusCode: 200, ok: true };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Error deleting order items: ' + (error as Error).message);

      if (error instanceof UserNotFoundError || error instanceof OrderNotFoundError || error instanceof UnauthorizedError || error instanceof InvalidInputError) {
        return { message: error.message, statusCode: 400, ok: false };
      }

      return { message: 'An error occurred!', statusCode: 500, ok: false };
    } finally {
      session.endSession();
    }
  }

  async delete(orderId: string, userId: string): Promise<MessageDto> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      // Find order and validate user
      const order = await this.orderModel.findById(orderId).populate<{ payment: PaymentDocument[] }>('payment').session(session);
      if (!order) {
        throw new OrderNotFoundError('Order does not exist');
      }
      if (!(order.buyerId.toString() === userId || order.sellerId.toString() === userId)) {
        throw new UnauthorizedError('You are not authorized to delete this order');
      }

      // // Type guard to check if payment is populated
      // const isPaymentPopulated = (payment: mongoose.Types.ObjectId | PaymentDocument): payment is PaymentDocument => {
      //   return (payment as PaymentDocument).sellerPaymentStatus !== undefined;
      // };

      if (order.payment && order.payment.length > 0) {
        if (order.payment[0].sellerPaymentStatus === 'paid' || order.payment[0].dispatcherPaymentStatus === 'paid') {
          throw new UnauthorizedError('You cannot delete a paid order');
        }
        if (order.payment[0].sellerPaymentStatus === 'inprocess' || order.payment[0].dispatcherPaymentStatus === 'inprocess') {
          const lastUpdateTime = new Date(order.payment[0].lastUpdateTime);
          const currentTime = new Date();
          const oneHourAgo = new Date(currentTime.getTime() - 3600000);
          if (oneHourAgo < lastUpdateTime) {
            throw new UnauthorizedError('You cannot delete an order that is in process');
          }
        }
      }

      // Delete order items
      await this.orderItemModel.deleteMany({ _id: { $in: order.orderItems } }).session(session);

      // Mark payments as deleted
      for (const payment of order.payment) {
          payment.isDeleted = true;
          payment.lastUpdateTime = new Date();
          await payment.save({ session });
      }

      // Delete the order
      await this.orderModel.findByIdAndDelete(orderId).session(session);

      await session.commitTransaction();
      return { message: 'Order was deleted successfully!', statusCode: 200, ok: true };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Error deleting order: ' + (error as Error).message);

      if (error instanceof UserNotFoundError || error instanceof OrderNotFoundError || error instanceof UnauthorizedError || error instanceof InvalidInputError) {
        return { message: error.message, statusCode: 400, ok: false };
      }

      return { message: 'An error occurred!', statusCode: 500, ok: false };
    } finally {
      session.endSession();
    }
  }

  async update(updateOrderInput: UpdateOrderInput, userId: string): Promise<MessageDto> {
    const { orderId, deliveryAddress, recievedByBuyer, deliveredByDispatcher } = updateOrderInput;

    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      // Find order and validate user
      const order = await this.orderModel.findById(orderId).session(session);
      if (!order) {
        throw new OrderNotFoundError('Order does not exist');
      }
      if (!(order.buyerId.toString() === userId || order.dispatcherId.toString() === userId)) {
        throw new UnauthorizedError('You are not authorized to update this order');
      }

      // Update order fields
      if (deliveryAddress && order.buyerId.toString() === userId) {
        order.deliveryAddress = _.trim(deliveryAddress);
      }
      if (recievedByBuyer && order.buyerId.toString() === userId) {
        order.recievedByBuyer = true;
      } else if (deliveredByDispatcher && order.dispatcherId.toString() === userId) {
        order.deliveredByDispatcher = true;
      } else {
        throw new InvalidInputError('An error occurred in your input');
      }

      await order.save({ session });
      await session.commitTransaction();
      return { message: 'Order was updated successfully!', id: orderId, statusCode: 200, ok: true };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('An error occurred while updating order: ' + (error as Error).message);

      if (error instanceof UserNotFoundError || error instanceof OrderNotFoundError || error instanceof UnauthorizedError || error instanceof InvalidInputError) {
        return { message: error.message, statusCode: 400, ok: false };
      }

      return { message: 'An error occurred!', statusCode: 500, ok: false };
    } finally {
      session.endSession();
    }
  }

  async updateOrderItems(orderId: string, orderItems: OrderItem2Input[], userId: string): Promise<MessageDto> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      // Find order and validate user
      const order = await this.orderModel.findById(orderId).populate<{ payment: PaymentDocument[] }>('payment').session(session);
      if (!order) {
        throw new OrderNotFoundError('Order does not exist');
      }
      if (order.buyerId.toString() !== userId) {
        throw new UnauthorizedError('You are not authorized to update this order item');
      }

      if (order.payment && order.payment.length > 0) {
        if (order.payment[0].sellerPaymentStatus === 'paid' || order.payment[0].dispatcherPaymentStatus === 'paid') {
          throw new UnauthorizedError('You cannot update a paid order\'s item');
        }
      }

      for (const item of orderItems) {
        const orderItem = await this.orderItemModel.findById(item.id).session(session);
        const items = order.orderItems.map((item) => item.toString());
        if (orderItem && items.includes(item.id)) {
          orderItem.quantity = item.quantity;
          await orderItem.save({ session });
        }
      }

      await session.commitTransaction();
      return { message: 'Order items updated successfully!', statusCode: 200, ok: true };
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Error updating order items: ' + (error as Error).message);

      if (error instanceof UserNotFoundError || error instanceof OrderNotFoundError || error instanceof UnauthorizedError || error instanceof InvalidInputError) {
        return { message: error.message, statusCode: 400, ok: false };
      }

      return { message: 'An error occurred!', statusCode: 500, ok: false };
    } finally {
      session.endSession();
    }
  }

  async findAll(page: number, limit: number): Promise<MessageDto> {
    const cacheKey = `orders_page_${page}_limit_${limit}`;
    try {
      // Check if the data is in the cache
      const cache = await this.cacheManager.get(cacheKey);
      if (cache) {
        const parsedData = JSON.parse(cache as string);
        return { ordersData: parsedData.orders, pagination: parsedData.pagination, statusCode: 200, ok: true };
      }

      // Fetch total number of items
      const totalItems = await this.orderModel.countDocuments().exec();

      // Fetch data from the database with pagination
      const ordersData = await this.orderModel
        .find()
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      if (!ordersData || ordersData.length === 0) {
        return { message: 'No orders were found!', statusCode: 404, ok: false };
      }

      // Calculate pagination details
      const totalPages = Math.ceil(totalItems / limit);
      const pagination = {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      };

      // Save the data in the cache for 1 hour (3600 seconds)
      await this.cacheManager.set(cacheKey, JSON.stringify({ orders: ordersData, pagination }));

      const ordersDto = ordersData.map(order => ({
        ...order.toObject(),
        dispatcherId: order.dispatcherId.toString(),
        id: order._id.toString(),
        orderItems: order.orderItems.map((item) => item.toString()),
        payment: order.payment.map((payment) => payment.toString())
      })) as unknown as OrderDto[];
      return { ordersData: ordersDto, pagination, statusCode: 200, ok: true };
    } catch (error) {
      this.logger.error('Error getting all orders: ' + (error as Error).message);
      return { message: 'An error occurred!', statusCode: 500, ok: false };
    }
  }

  findOne(orderItemId: string): Promise<OrderDocument> {
    return this.orderModel.findOne({ 'orderItems._id': orderItemId }).exec();
  }

  async findMyOrderItems(userId: string, orderId: string): Promise<MessageDto> {
    const cacheKey = `user_${userId}_order_${orderId}_items`;
    try {
      // Check if the data is in the cache
      const cache = await this.cacheManager.get(cacheKey);
      if (cache) {
        const parsedData = JSON.parse(cache as string);
        return { orderItemsData: parsedData.orderItems, statusCode: 200, ok: true };
      }

      // Find the order
      const order = await this.orderModel.findOne({
        $or: [
          { buyerId: userId },
          { sellerId: userId },
          { dispatcherId: userId },
        ],
        _id: orderId,
      }).exec();

      if (!order) {
        throw new OrderNotFoundError('Order not found');
      }

      // Find the order items
      const orderItemsData = await this.orderItemModel.find({ _id: { $in: order.orderItems } }).exec();

      // Save the data in the cache for 1 hour (3600 seconds)
      await this.cacheManager.set(cacheKey, JSON.stringify({ orderItemsData }));

      const orderItemsDto = orderItemsData.map(item => ({
        ...item.toObject(),
        productId: item.productId.toString(),
        id: item._id.toString()
      }));
      return { orderItemsData: orderItemsDto, statusCode: 200, ok: true };
    } catch (error) {
      this.logger.error('Error getting my order items: ' + (error as Error).message);
      return { message: 'An error occurred!', statusCode: 500, ok: false };
    }
  }

  async findMyOrders(userId: string, page: number, limit: number): Promise<MessageDto> {
    const cacheKey = `user_${userId}_orders_page_${page}_limit_${limit}`;
    try {
      // Check if the data is in the cache
      const cache = await this.cacheManager.get(cacheKey);
      if (cache) {
        const parsedData = JSON.parse(cache as string);
        return { ordersData: parsedData.orders, pagination: parsedData.pagination, statusCode: 200, ok: true };
      }

      // Fetch total number of items
      const totalItems = await this.orderModel.countDocuments({ buyerId: userId }).exec();

      // Fetch data from the database with pagination
      const ordersData = await this.orderModel
        .find({ buyerId: userId })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      if (!ordersData || ordersData.length === 0) {
        return { message: 'No orders were found!', statusCode: 404, ok: false };
      }

      // Calculate pagination details
      const totalPages = Math.ceil(totalItems / limit);
      const pagination = {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      };

      const ordersDto = ordersData.map(order => ({
        ...order.toObject(),
        dispatcherId: order.dispatcherId.toString(),
        id: order._id.toString(),
        orderItems: order.orderItems.map((item) => item.toString()),
        payment: order.payment.map((payment) => payment.toString())
      })) as unknown as OrderDto[];
      // Save the data in the cache for 1 hour (3600 seconds)
      await this.cacheManager.set(cacheKey, JSON.stringify({ orders: ordersDto, pagination }));

      return { ordersData: ordersDto, pagination, statusCode: 200, ok: true };
    } catch (error) {
      this.logger.error('Error getting my orders: ' + (error as Error).message);
      return { message: 'An error occurred!', statusCode: 500, ok: false };
    }
  }

  async findTheOrderAsDispatcher(userId: string, page: number, limit: number): Promise<MessageDto> {
    const cacheKey = `dispatcher_${userId}_orders_page_${page}_limit_${limit}`;
    try {
      // Check if the data is in the cache
      const cache = await this.cacheManager.get(cacheKey);
      if (cache) {
        const parsedData = JSON.parse(cache as string);
        return { ordersData: parsedData.orders, pagination: parsedData.pagination, statusCode: 200, ok: true };
      }

      // Fetch total number of items
      const totalItems = await this.orderModel.countDocuments({ dispatcherId: userId }).exec();

      // Fetch data from the database with pagination
      const ordersData = await this.orderModel
        .find({ dispatcherId: userId })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      if (!ordersData || ordersData.length === 0) {
        return { message: 'No orders were found!', statusCode: 404, ok: false };
      }

      // Calculate pagination details
      const totalPages = Math.ceil(totalItems / limit);
      const pagination = {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      };

      const ordersDto = ordersData.map(order => ({
        ...order.toObject(),
        dispatcherId: order.dispatcherId.toString(),
        id: order._id.toString(),
        orderItems: order.orderItems.map((item) => item.toString()),
        payment: order.payment.map((payment) => payment.toString())
      })) as unknown as OrderDto[];

      // Save the data in the cache for 1 hour (3600 seconds)
      await this.cacheManager.set(cacheKey, JSON.stringify({ orders: ordersDto, pagination }));

      return { ordersData: ordersDto, pagination, statusCode: 200, ok: true };
    } catch (error) {
      this.logger.error('Error getting order as dispatcher: ' + (error as Error).message);
      return { message: 'An error occurred!', statusCode: 500, ok: false };
    }
  }

  async findTheOrderAsSeller(userId: string, page: number, limit: number): Promise<MessageDto> {
    const cacheKey = `seller_${userId}_orders_page_${page}_limit_${limit}`;
    try {
      // Check if the data is in the cache
      const cache = await this.cacheManager.get(cacheKey);
      if (cache) {
        const parsedData = JSON.parse(cache as string);
        return { ordersData: parsedData.orders, pagination: parsedData.pagination, statusCode: 200, ok: true };
      }

      // Fetch total number of items
      const totalItems = await this.orderModel.countDocuments({ sellerId: userId }).exec();

      // Fetch data from the database with pagination
      const ordersData = await this.orderModel
        .find({ sellerId: userId })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      if (!ordersData || ordersData.length === 0) {
        return { message: 'No orders were found!', statusCode: 404, ok: false };
      }

      // Calculate pagination details
      const totalPages = Math.ceil(totalItems / limit);
      const pagination = {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      };

      const ordersDto = ordersData.map(order => ({
        ...order.toObject(),
        dispatcherId: order.dispatcherId.toString(),
        id: order._id.toString(),
        orderItems: order.orderItems.map((item) => item.toString()),
        payment: order.payment.map((payment) => payment.toString())
      })) as unknown as OrderDto[];
      // Save the data in the cache for 1 hour (3600 seconds)
      await this.cacheManager.set(cacheKey, JSON.stringify({ orders: ordersDto, pagination }));

      return { ordersData: ordersDto, pagination, statusCode: 200, ok: true };
    } catch (error) {
      this.logger.error('Error getting order as seller: ' + (error as Error).message);
      return { message: 'An error occurred!', statusCode: 500, ok: false };
    }
  }
}
