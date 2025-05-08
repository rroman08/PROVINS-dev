import { Listener, OrderCreatedEvent, Subjects } from '@provins/common';
import { Message } from 'node-nats-streaming';

import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

// This class is responsible for listening to order:created events
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  // On receiving an order:created event it creates a new order in the database
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      status: data.status,
      userId: data.userId,
      price: data.product.price,
      version: data.version,
    });
    await order.save();
    
    msg.ack();
  }
}
