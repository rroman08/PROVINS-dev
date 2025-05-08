import { Listener, Subjects, ExpirationCompleteEvent } from '@provins/common';
import { Message } from 'node-nats-streaming';

import { queueGroupName } from './queue-group-name';
import { Order, OrderStatus } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

// This listener listens for expiration:complete and updates the order status to cancelled
// upon receival. 
// It also publishes an order:cancelled event to notify other services of the cancellation
// and the product is available for purchase again
export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('product');

    if (!order) {
      throw new Error('Order not found');
    }

    // If order has alredy been paid for, i.e., status is complete, 
    // there is no need to cancel the order
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    // Set order status to cancelled on own database before publishing
    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      product: {
        id: order.product.id,
        price: order.product.price,
      },
    });

    msg.ack();
  }
}
