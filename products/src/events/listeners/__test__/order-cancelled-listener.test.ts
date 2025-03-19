import { OrderCancelledEvent } from '@provins/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { Product } from '../../../models/product';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const product = Product.build({
    title: 'Running Shoes',
    price: 99.99,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });

  const orderId = new mongoose.Types.ObjectId().toHexString();
  product.set({ orderId: orderId });

  await product.save();

  const data: OrderCancelledEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    product: {
      id: product.id,
      price: product.price
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, product, data, msg, orderId };
};

it ('updates product, publishes an event, and acks', async () => {
  const { listener, product, data, msg, orderId } = await setup();
  await listener.onMessage(data, msg);

  const updatedProduct = await Product.findById(product.id);

  expect(updatedProduct!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});