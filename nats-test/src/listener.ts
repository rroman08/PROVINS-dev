import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const client = nats.connect('provins', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

client.on('connect', () => {
  console.log('Listener connected to NATS');

  const options = client.subscriptionOptions()
    .setManualAckMode(true);

  // 1st arg name of channel
  // 2nd arg is for queue group
  const subscription = client.subscribe('product:created', 'listenerQG', options);

  // message = event
  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }

    msg.ack();
  });
});
