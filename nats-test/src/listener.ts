import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';

import { ProductCreatedListener } from './events/product-created-listener';

// Connect test base-listener for prototyping purposes
console.clear();

const client = nats.connect('provins', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

client.on('connect', () => {
  console.log('Listener connected to NATS');

  client.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  });

  new ProductCreatedListener(client).listen();
});

// Close the connection when the process is terminated (restart or stop)
process.on('SIGINT', () => client.close());
process.on('SIGTERM', () => client.close());
