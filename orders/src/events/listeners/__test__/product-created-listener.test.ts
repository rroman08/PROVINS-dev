import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { ProductCreatedEvent } from '@provins/common';

import { ProductCreatedListener } from '../product-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Product } from '../../../models/product';

const setup = async () => {
  // Instantiate listener
  const listener = new ProductCreatedListener(natsWrapper.client);
  // Create dummy  data event
  const data: ProductCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'Running Shoes',
    price: 99.99,
    userId: new mongoose.Types.ObjectId().toHexString()
  };
  // Create dummy msg object
  // @ts-ignore
  const msg: Message = { ack: jest.fn() }

  return { listener, data, msg };
};

it ('creates and saves a product', async () => {
  const { listener, data, msg } = await setup();
  // Call onMessage fn with data object and msg object
  await listener.onMessage(data, msg);
  // Assert product created
  const product = await Product.findById(data.id);
  expect(product).toBeDefined();
  expect(product!.title).toEqual(data.title);
  expect(product!.price).toEqual(data.price);
});

it ('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  // Assert ack fn called
  expect(msg.ack).toHaveBeenCalled();
});
