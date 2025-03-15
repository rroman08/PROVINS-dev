import nats from 'node-nats-streaming';

import { ProductCreatedPublisher } from './events/product-created-publisher';

console.clear();

const client = nats.connect('provins', 'abc', {
  url: 'http://localhost:4222',
});

client.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new ProductCreatedPublisher(client);
  try {
    await publisher.publish({
      id: '123',
      title: 'Running Shoes',
      price: 10000000
    });
  } catch (err) {
    console.error(err);
  }
});
