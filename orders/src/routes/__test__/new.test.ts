import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../../app';
import { Product } from '../../models/product';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it ('returs an error if the product does not exist', async () => {
  const productId = new mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ productId })
    .expect(404);
});

it ('returs an error if the product is reserved already', async () => {
  const product = Product.build({
    title: 'Running Shoes',
    price: 99.99
  });
  await product.save();

  const order = Order.build({
    product,
    userId: 'testId',
    status: OrderStatus.Created,
    expiresAt: new Date()
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ productId: product.id })
    .expect(400);
});

it ('reserves the product successfully', async () => {
  const product = Product.build({
    title: 'Running Shoes',
    price: 99.99
  });
  await product.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ productId: product.id })
    .expect(201);
});

it ('emits an order created event', async () => {
  const product = Product.build({
    title: 'Running Shoes',
    price: 99.99
  });
  await product.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ productId: product.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
