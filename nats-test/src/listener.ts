import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

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

// Close the connection when the process is terminated (restart or stop)
process.on('SIGINT', () => client.close());
process.on('SIGTERM', () => client.close());
