import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';

it('returns a 404 if the product is NOT found', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  
  await request(app)
    .get(`/api/products/${userId}`)
    .send()
    .expect(404);
});

it('returns the product if product is found', async () => {
  const title = 'Running Shoes';
  const price = 99.99;

  const response = await request(app)
    .post('/api/products')
    .set('Cookie', global.signup())
    .send({
      title,
      price
    })
    .expect(201);

  const productResponse = await request(app)
    .get(`/api/products/${response.body.id}`)
    .send()
    .expect(200);

  expect(productResponse.body.title).toEqual(title);
  expect(productResponse.body.price).toEqual(price);
});
