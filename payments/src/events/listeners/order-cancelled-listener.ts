import { 
  OrderCancelledEvent, 
  Subjects, 
  Listener, 
  OrderStatus 
} from '@provins/common';
import { Message } from 'node-nats-streaming';

import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

// This class is responsible for listening to order:cancelled events
export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  // On receiving an order:cancelled event it finds the order in the database and updates its status
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
  
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Set the order status to cancelled before saving
    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}
