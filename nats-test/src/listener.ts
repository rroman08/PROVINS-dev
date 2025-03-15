import nats, { Message, Stan } from 'node-nats-streaming';
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

  new ProductCreatedListener(client).listen();
});

// Close the connection when the process is terminated (restart or stop)
process.on('SIGINT', () => client.close());
process.on('SIGTERM', () => client.close());

abstract class Listener {
  abstract subject: string;
  abstract queueGroupName: string;
  abstract onMessage(data: any, msg: Message): void;

  private client: Stan;
  protected ackWait = 5000;  // milliseconds

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client.subscriptionOptions()
      .setManualAckMode(true)
      .setDeliverAllAvailable()
      .setDurableName(this.queueGroupName)
      .setAckWait(this.ackWait);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString('utf-8'));
  }
}

class ProductCreatedListener extends Listener {
  subject = 'product:created';
  queueGroupName = 'queue-group';

  onMessage(data: any, msg: Message) {
    console.log('Event data!', data);

    msg.ack();
  }
}