import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { Product } from '../../models/product';

it('fetches the order successfully', async () => {  
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

  const fetchedOrderResponse = await request(app)
    .get(`/api/orders/${orderResponse.id}`)
    .set('Cookie', user)
    .send()
    .expect(200); 

  expect(fetchedOrderResponse.body.id).toEqual(orderResponse.id);
  expect(fetchedOrderResponse.body.product.id).toEqual(product.id);
});

it('returns 401 if user is NOT authenticated', async () => {
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

  const fetchedOrderResponse = await request(app)
    .get(`/api/orders/${orderResponse.id}`)
    .set('Cookie', global.signup())
    .send()
    .expect(401);
});
