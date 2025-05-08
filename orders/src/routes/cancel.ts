import express, { Request, Response } from 'express';
import { NotAuthorisedError, NotFoundError } from '@provins/common';

import { Order, OrderStatus } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

// This route handler is responsible for cancelling an order
// It checks if the order exists, if the user is authorised to cancel it,
// and then updates the order status to cancelled
router.patch('/api/orders/:orderId', async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate('product');

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorisedError();
  }

  order.status = OrderStatus.Cancelled;
  await order.save();

  // Publish an order:cancelled event
  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    product: {
      id: order.product.id,
      price: order.product.price
    }
  });

  res.status(200).send(order);
});

export { router as cancelOrderRouter };
