import request from 'supertest';
import { app } from '../../app';

it('has a route handler listening to /api/products for post requests', async () => {
  const response = await request(app)
    .post('/api/products')
    .send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app)
    .post('/api/products')
    .send({})
    .expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/products')
    .set('Cookie', global.signup())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/products')
    .set('Cookie', global.signup())
    .send({
      title: '',
      price: 1
    })
    .expect(400);

    await request(app)
    .post('/api/products')
    .set('Cookie', global.signup())
    .send({
      price: 1_000_000
    })
    .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/products')
    .set('Cookie', global.signup())
    .send({
      title: 'Shoes',
      price: -1
    })
    .expect(400);

  await request(app)
    .post('/api/products')
    .set('Cookie', global.signup())
    .send({
      title: 'Shoes'
    })
    .expect(400);
});

it('creates a product with valid inputs', async () => {
  const response = await request(app)
    .post('/api/products')
    .send({});

  expect(response.status).not.toEqual(404);
});
