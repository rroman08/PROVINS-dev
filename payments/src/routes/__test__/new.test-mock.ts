import request from 'supertest';
import mongoose from 'mongoose';
import { OrderStatus } from '@provins/common';

import { app } from '../../app';
import { Order } from '../../models/order';
import stripe from '../../stripe';

jest.mock('../../stripe');

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
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 99.99,
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

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.amount).toEqual(9999);
  expect(chargeOptions.currency).toEqual('gbp');
});
