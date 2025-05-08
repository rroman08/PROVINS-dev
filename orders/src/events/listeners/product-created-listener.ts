import { Message } from 'node-nats-streaming';
import { Listener, ProductCreatedEvent, Subjects } from '@provins/common';

import { Product } from '../../models/product';
import { queueGroupName } from './queue-group-name';

// This listener listens for product:created and creates the product in the database
export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: ProductCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;
    const product = Product.build({
      id,
      title,
      price,
    });
    await product.save();

    msg.ack();
  }
}
