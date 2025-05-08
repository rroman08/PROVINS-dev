import { Message } from 'node-nats-streaming';

import { Listener } from './base-listener';
import { ProductCreatedEvent } from './product-created-event';
import { Subjects } from './subjects';

// This test ProductCreatedListener is a listener for the ProductCreatedEvent and
// extends the base Listener class. It specifies the subject it listens to and the queue group name
// onMessage must be implemented to handle the event when it is received
export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
  readonly subject: Subjects.ProductCreated = Subjects.ProductCreated;
  queueGroupName = 'queue-group';

  onMessage(data: ProductCreatedEvent['data'], msg: Message) {
    console.log('Event data!', data);

    msg.ack();
  }
}
