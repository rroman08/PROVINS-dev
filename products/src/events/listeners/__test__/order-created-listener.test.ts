import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderCreatedEvent, OrderStatus } from '@provins/common';
import { Message } from 'node-nats-streaming';

import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Product } from '../../../models/product';

const setup = async () => {
  // Instatiate listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create a product
  const product = Product.build({
    title: 'Running Shoes',
    price: 99.99,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await product.save();

  // Create dummy data event/object
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: 'testdate',
    product: {
      id: product.id,
      price: product.price
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, product, data, msg };
}
