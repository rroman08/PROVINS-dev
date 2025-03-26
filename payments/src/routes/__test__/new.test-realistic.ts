import request from 'supertest';
import mongoose from 'mongoose';
import { OrderStatus } from '@provins/common';

import { app } from '../../app';
import { Order } from '../../models/order';
import stripe from '../../stripe';
import e from 'express';

it('returns 404 when trying to purchase a non-existing order', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup())
    .send({
      token: 'testtoken',
      orderId: new mongoose.Types.ObjectId().toHexString()
    }).expect(404);
});

it('returns 401 when trying to purchase someone elses order', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 99.99,
    status: OrderStatus.Created
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup())
    .send({
      token: 'testtoken',
      orderId: order.id
    }).expect(401);
});

it('returns 400 when trying to purchase cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 99.99,
    status: OrderStatus.Cancelled
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup(userId))
    .send({
      orderId: order.id,
      token: 'testtoken'
    }).expect(400);
});

it ('returns 204 with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: price,
    status: OrderStatus.Created
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup(userId))
    .send({
      orderId: order.id,
      token: 'tok_visa'
    }).expect(204);

  const stripeCharges = await stripe.charges.list({ limit: 10 });
  const stripeCharge = stripeCharges.data.find(charge => charge.amount === price * 100);

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual('gbp');
});
