import { Module } from '@nestjs/common';
import { OrderService } from '@/order/order.service';
import { OrderResolver } from '@/order/order.resolver';
import { Order, OrderSchema, OrderItem, OrderItemSchema, OrderDocument } from '@/order/schemas/order.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from '@/product/product.module';
import { Model } from 'mongoose';
import { IOrderItem } from '@/order/interfaces/order-item.interface';
import { IProduct } from '@/product/interfaces/product.interface';

@Module({
  providers: [OrderResolver, OrderService],
  imports: [
    MongooseModule.forFeatureAsync([
      { 
        name: Order.name, 
        useFactory: () => {
          OrderSchema.pre<OrderDocument>('save', async function (next) {
            try {
              const items = this.orderItems;
              let totalAmount = 0;
              const orderItemModel = this.model<Model<IOrderItem>>('OrderItem');
              const productModel = this.model<Model<IProduct>>('Product');
            
              for (const item of items) {
                const orderItem = await orderItemModel.findById(item);
                if (orderItem?.productId) {
                  const product = await productModel.findById(orderItem.productId);
                  if (product?.price && orderItem.quantity) {
                    totalAmount += product.price * orderItem.quantity;
                  }
                }
              }
              this.totalAmount = totalAmount;
              next();
            } catch (error) {
              next(error);
            }
          });

          return OrderSchema;
        },
      },
      { 
        name: OrderItem.name, 
        useFactory: () => OrderItemSchema
      },  
    ]),
    ProductModule
  ],
  exports: [MongooseModule]
})
export class OrderModule {}