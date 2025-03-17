import express, { Request, Response } from 'express';
import { 
  NotAuthorisedError, 
  NotFoundError, 
  requireAuth 
} from '@provins/common';

import { Order, OrderStatus } from '../models/order';

const router = express.Router();

router.patch('/api/orders/:orderId', async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorisedError();
  }

  order.status = OrderStatus.Cancelled;
  await order.save();

  res.status(200).send(order);
});

export { router as cancelOrderRouter };
