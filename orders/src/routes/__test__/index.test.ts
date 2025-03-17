import request from 'supertest';

import { app } from '../../app';
import { Product } from '../../models/product';

it ('fetches orders for specific user', async () => {
  // Create 3 products
  const productOne = Product.build({
    title: 'Running Shoes',
    price: 99.99
  });
  await productOne.save();

  const productTwo = Product.build({
    title: 'Trail Shoes',
    price: 79.99
  });
  await productTwo.save();

  const productThree = Product.build({
    title: 'Track Shoes',
    price: 149.99
  });
  await productThree.save();

  // Create two orders for user-1
  const userOne = global.signup();
  const { body: orderResponseOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ productId: productOne.id })
    .expect(201);

    const { body: orderResponseTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ productId: productTwo.id })
    .expect(201);

  // Create one orders for user-2
  const userTwo = global.signup();
  await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ productId: productThree.id })
    .expect(201);

  // Make request to get orders for user-1
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userOne)
    .send()
    .expect(200);

  // Verify only got orders for user-1
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderResponseOne.id);
  expect(response.body[1].id).toEqual(orderResponseTwo.id); 
  expect(response.body[0].product.id).toEqual(productOne.id);
  expect(response.body[1].product.id).toEqual(productTwo.id);
});
