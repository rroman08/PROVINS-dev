import { Message } from 'node-nats-streaming';
import { Listener, ProductUpdatedEvent, Subjects } from '@provins/common';

import { Product } from '../../models/product';
import { queueGroupName } from './queue-group-name';

// This listener listens for product:updates and updates the product in the database
// upon receival
export class ProductUpdatedListener extends Listener<ProductUpdatedEvent> {
  subject: Subjects.ProductUpdated = Subjects.ProductUpdated;
  queueGroupName = queueGroupName;

  // Uses current version of the product to finds the product with version number
  // one lower in the database (version control for out-of-order messages)
  async onMessage(data: ProductUpdatedEvent['data'], msg: Message) {
    const product = await Product.findByIdAndPreviousVersion(data);

    if (!product) {
      throw new Error('Product not found');
    }

    const { title, price } = data;
    product.set({ title, price});
    await product.save();
    
    msg.ack();
  }
}