import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@provins/common';

import { queueGroupName } from './queue-group-name';
import { Product } from '../../models/product';
import { ProductUpdatedPublisher } from '../publishers/product-updated-publisher';

// This class listens for order:created events and changes the status of the product
// so that it is reserved
// It extends the Listener class and sets the subject to OrderCreated
// Also set a ququeue group name
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  // This method is called when an order:created event is received
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find product that is being reserved by order
    const product = await Product.findById(data.product.id);
    if (!product) {
      throw new Error('Product not found');
    }
    // Mark product as reserved -> set orderId property, and save
    // A set orderId property acts as a proxy for the product being reserved
    // This is a design choice, and could be changed to a boolean
    product.set({ orderId: data.id });
    await product.save();

    // Publish product:updated event
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
