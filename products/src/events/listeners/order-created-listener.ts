import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from '@provins/common';

import { queueGroupName } from './queue-group-name';
import { Product } from '../../models/product';
import { ProductUpdatedPublisher } from '../publishers/product-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find product that is being reserved by order
    const product = await Product.findById(data.product.id);
    if (!product) {
      throw new Error('Product not found');
    }
    // Mark product as reserved -> set orderId property, and save
    product.set({ orderId: data.id });
    await product.save();

    // Publish product updated event
    await new ProductUpdatedPublisher(this.client).publish({
      id: product.id,
      title: product.title,
      price: product.price,
      userId: product.userId,
      orderId: product.orderId,
      version: product.version,
    });

    msg.ack();
  }
}
