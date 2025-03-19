import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from '@provins/common';

import { queueGroupName } from './queue-group-name';
import { Product } from '../../models/product';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find product that is being reserved by order
    const product = await Product.findById(data.product.id);
    if (!product) {
      throw new Error('Product not found');
    }
    // Mark product as reserved -> set orderId property
    product.set({ orderId: data.id });
    await product.save();

    msg.ack();
  }
}
