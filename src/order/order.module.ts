import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import  { Order, OrderSchema, OrderItem, OrderItemSchema } from './schemas/order.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  providers: [OrderResolver, OrderService],
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: OrderItem.name, schema: OrderItemSchema },  
    ]),
  ],
  exports: [MongooseModule]
})
export class OrderModule {}
