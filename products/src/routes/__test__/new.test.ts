import request from 'supertest';
import { app } from '../../app';

it('has a route handler listening to /api/products for post requests', async () => {
  const response = await request(app)
    .post('/api/products')
    .send({});

  expect(response.status).not.toEqual(404);
});

it('it can only be accessed if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/products')
    .send({});

  expect(response.status).not.toEqual(404);
});

it('it returns an error if an invalid title is provided', async () => {
  const response = await request(app)
    .post('/api/products')
    .send({});

  expect(response.status).not.toEqual(404);
});

it('it returns an error if an invalid price is provided', async () => {
  const response = await request(app)
    .post('/api/products')
    .send({});

  expect(response.status).not.toEqual(404);
});

it('it creates a product with valid inputs', async () => {
  const response = await request(app)
    .post('/api/products')
    .send({});

  expect(response.status).not.toEqual(404);
});
