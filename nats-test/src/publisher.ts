import nats from 'node-nats-streaming';

const client = nats.connect('provins', 'abc', {
  url: 'http://localhost:4222',
});

client.on('connect', () => {
  console.log('Publisher connected to NATS');
});
