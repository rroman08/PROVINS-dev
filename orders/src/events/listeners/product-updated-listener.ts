import { Message } from 'node-nats-streaming';
import { Listener, ProductUpdatedEvent, Subjects } from '@provins/common';

import { Product } from '../../models/product';
import { queueGroupName } from './queue-group-name';

export class ProductUpdatedListener extends Listener<ProductUpdatedEvent> {
  subject: Subjects.ProductUpdated = Subjects.ProductUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: ProductUpdatedEvent['data'], msg: Message) {
    const product = await Product.findOne({
      _id: data.id,
      version: data.version - 1,  // if a version with -1 exists in db
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const { title, price } = data;
    product.set({ title, price});
    await product.save();
    
    msg.ack();
  }
}