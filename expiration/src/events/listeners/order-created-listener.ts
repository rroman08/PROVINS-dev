import { Listener, OrderCreatedEvent, Subjects } from '@provins/common';
import { Message } from 'node-nats-streaming';

import { expirationQueue } from '../../queues/expiration-queue';
import { queueGroupName } from './queue-group-name';


// OrderCreatedListener listens for order:created events and adds a job to the expiration queue
// with a delay until the order expires.
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  
  // The expiration time is set to 10 minutes after the order is created.
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    // Add a job to the expiration queue with the order ID and the delay
    await expirationQueue.add(
      { orderId: data.id }, 
      { delay: delay }  // 10 minutes
    );

    // Ack processing to NATS
    msg.ack();
  }
}
