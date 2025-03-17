import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

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

it('returns a 401 if the user does not own the product', async () => {
  const response = await request(app)
    .post('/api/products')
    .set('Cookie', global.signup())
    .send({
      title: 'Running Shoes',
      price: 99.99,
    });

  await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', global.signup())
    .send({
      title: 'Trail Shoes',
      price: 79.99,
    })
    .expect(401);
});

it('returns a 400 if the user provide an invalid title or price', async () => {
  const cookie = global.signup();

  const response = await request(app)
  .post('/api/products')
  .set('Cookie', cookie)
  .send({
    title: 'Running Shoes',
    price: 99.99,
  });

  await request(app)
  .put(`/api/products/${response.body.id}`)
  .set('Cookie', cookie)
  .send({
    title: '',
    price: 79.99,
  })
  .expect(400);

  await request(app)
  .put(`/api/products/${response.body.id}`)
  .set('Cookie', cookie)
  .send({
    title: 'Trail Shoes',
    price: -1,
  })
  .expect(400);
});

it('updates the product provided valid inputs', async () => {
  const cookie = global.signup();

  const response = await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: 'Running Shoes',
      price: 99.99,
    });

  await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Trail Shoes',
      price: 79.99,
    })
    .expect(200);

  const productResponse = await request(app)
    .get(`/api/products/${response.body.id}`)
    .send();
    
  expect(productResponse.body.title).toEqual('Trail Shoes');
  expect(productResponse.body.price).toEqual(79.99);
});

it ('publishes an event', async () => {
  const cookie = global.signup();

  const response = await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: 'Running Shoes',
      price: 99.99,
    });

  await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Trail Shoes',
      price: 79.99,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
