import { Message } from 'node-nats-streaming';

import { Listener } from './base-listener';
import { ProductCreatedEvent } from './product-created-event';
import { Subjects } from './subjects';

export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated;
  queueGroupName = 'queue-group';

  onMessage(data: any, msg: Message) {
    console.log('Event data!', data);

    msg.ack();
  }
}
