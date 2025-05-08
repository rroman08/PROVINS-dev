import { Stan } from 'node-nats-streaming';

import { Subjects } from './subjects';

// Requires an interface because TypeScript needs to know the structure of the event
interface Event {
  subject: Subjects;
  data: any;
}

// This base publisher class is generic and can be used for any event type
export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  // This method is used to publish the event
  // It takes the data as an argument and publishes it to the NATS server
  publish(data: T['data']): Promise<void> {
    return new Promise((resolve, reject) => {
      // NATS expects the data to be a string
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }
        console.log('Event published to subject:', this.subject);
        resolve();
      });
    });
  }
}
