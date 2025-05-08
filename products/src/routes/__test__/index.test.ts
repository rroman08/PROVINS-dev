import request from 'supertest';
import { app } from '../../app';

const createProduct = () => {
  return request(app)
    .post('/api/products')
    .set('Cookie', global.signup())
    .send({
      title: 'Running shoes',
      price: 99.99
    });
};

it('fetches a list of products', async () => {
  await createProduct();
  await createProduct();
  await createProduct();

  const response = await request(app)
    .get('/api/products')
    .send()
    .expect(200);
  
  expect(response.body.length).toEqual(3);
});