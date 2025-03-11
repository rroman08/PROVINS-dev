import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';

it('returns a 404 if the provided userId does not exist', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/products/${userId}`)
    .set('Cookie', global.signup())
    .send({
      title: 'Running Shoes',
      price: 99.99,
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/products/${id}`)
    .send({
      title: 'Running Shoes',
      price: 99.99,
    })
    .expect(401);
});

it('returns a 401 if the user does not own the product', async () => {});

it('returns a 400 if the user provide an invalid title or price', async () => {});

it('updates the ticket provided valid inputs', async () => {});
