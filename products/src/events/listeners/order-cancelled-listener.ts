import { Message } from 'node-nats-streaming';
import { Listener, OrderCancelledEvent, Subjects } from '@provins/common';

import { queueGroupName } from './queue-group-name';
import { Product } from '../../models/product';
import { ProductUpdatedPublisher } from '../publishers/product-updated-publisher';

// This class listens for order:cancelled events and updates the product accordingly
// It extends the Listener class and sets the subject to OrderCancelled
// It also sets the queue group name to the current service
export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  // This method is called when an order:cancelled event is received
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // Find product being cancelled
    const product = await Product.findById(data.product.id);
    if (!product) {
      throw new Error('Product not found');
    }
    // Mark product as reserved -> set orderId property, and save
    product.set({ orderId: undefined });  // null does not work very well with ts, hence use undefined
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
