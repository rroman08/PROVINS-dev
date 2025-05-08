import { Message, Stan } from 'node-nats-streaming';

import { Subjects } from './subjects';

// Requires an interface because TypeScript needs to know the structure of the event
interface Event {
  subject: Subjects;
  data: any;
}

// Base class for all listeners
// This class is generic and can be used for any event type
export abstract class Listener<T extends Event> {
  abstract subject: T['subject'];
  abstract queueGroupName: string;
  abstract onMessage(data: T['data'], msg: Message): void;

  private client: Stan;
  protected ackWait = 5000;  // milliseconds

  constructor(client: Stan) {
    this.client = client;
  }

  // This method is used to set the subscription options
  subscriptionOptions() {
    return this.client.subscriptionOptions()
      .setManualAckMode(true)  // enable manual acknowledgment
      .setDeliverAllAvailable()  // start from the beginning of the stream
      .setDurableName(this.queueGroupName)  // durable subscription means it will remember the last acknowledged message
      .setAckWait(this.ackWait);  // set the acknowledgment wait time
  }

  // This method is used to subscribe to the event
  // Configures the subscription and sets up the message handler
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

  // Parse the message data to JSON
  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString('utf-8'));
  }
}
