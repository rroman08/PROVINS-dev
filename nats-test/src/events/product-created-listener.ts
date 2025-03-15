import { Message } from 'node-nats-streaming';

import { Listener } from './base-listener';

export class ProductCreatedListener extends Listener {
  subject = 'product:created';
  queueGroupName = 'queue-group';

  onMessage(data: any, msg: Message) {
    console.log('Event data!', data);

    msg.ack();
  }
}
