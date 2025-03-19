import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { Product } from '../../models/product';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it ('changes status of order to cancelled', async () => {
  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Running Shoes',
    price: 99.99
  });
  await product.save();

  const user = global.signup();
  const { body: orderResponse } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ productId: product.id })
    .expect(201);

  await request(app)
    .patch(`/api/orders/${orderResponse.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  const updatedOrder = await Order.findById(orderResponse.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it ('emits an order cancelled event', async () => {
  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Running Shoes',
    price: 99.99
  });
  await product.save();

  const user = global.signup();
  const { body: orderResponse } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ productId: product.id })
    .expect(201);

  await request(app)
    .patch(`/api/orders/${orderResponse.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
