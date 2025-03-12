import nats, { Message } from 'node-nats-streaming';

console.clear();

const client = nats.connect('provins', '123', {
  url: 'http://localhost:4222',
});

client.on('connect', () => {
  console.log('Listener connected to NATS');

  const subscription = client.subscribe('product:created');

  // message = event
  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }
  });
});
