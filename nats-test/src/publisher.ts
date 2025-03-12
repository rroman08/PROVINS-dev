import nats from 'node-nats-streaming';

const client = nats.connect('provins', 'abc', {
  url: 'http://localhost:4222',
});

client.on('connect', () => {
  console.log('Publisher connected to NATS');

  // NATS expects the data to be a string
  // Other word for data/event is also message (used in the NATS documentation)
  const data = JSON.stringify({
    id: '123',
    title: 'Running Shoes',
    price: 99.99,
  });

  client.publish('product:created', data, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Event published');
    }
  });
});
