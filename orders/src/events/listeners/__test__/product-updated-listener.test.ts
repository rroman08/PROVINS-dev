import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { ProductUpdatedEvent } from '@provins/common';

import { ProductUpdatedListener } from '../product-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Product } from '../../../models/product';

const setup = async () => {
  // Instantiate listener
  const listener = new ProductUpdatedListener(natsWrapper.client);
  // Create and save product
  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Running Shoes',
    price: 99.99
  });
  await product.save();
  // Create dummy data event/object
  const data: ProductUpdatedEvent['data'] = {
    id: product.id,
    version: product.version + 1,
    title: 'Trail Shoes',
    price: 79.99,
    userId: new mongoose.Types.ObjectId().toHexString()
  };
  // Create dummy msg object
  // @ts-ignore
  const msg: Message = { ack: jest.fn() }

  return { listener, data, msg, product };
};

it ('finds, updates, and saves product', async () => {
  const { listener, data, msg, product } = await setup();
  // Call onMessage fn with data object and msg object
  await listener.onMessage(data, msg);
  
  const updatedProduct = await Product.findById(product.id);

  // Assert product found, updated, and saved
  expect(updatedProduct!.title).toEqual(data.title);
  expect(updatedProduct!.price).toEqual(data.price);
  expect(updatedProduct!.version).toEqual(data.version);  
});

it ('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  // Assert ack fn called
  expect(msg.ack).toHaveBeenCalled();
});
