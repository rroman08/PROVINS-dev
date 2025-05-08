import express, { Request, Response } from 'express';
import { 
  NotAuthorisedError, 
  NotFoundError, 
  requireAuth 
} from '@provins/common';

import { Order } from '../models/order';

const router = express.Router();

// This route handler is responsible for fetching a specific order by its ID
// to display its details
router.get('/api/orders/:orderId', requireAuth,async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate('product');
  if (!order) {
    throw new NotFoundError;
  }
  // Check if the order belongs to the current user
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorisedError;
  }

  res.send(order);
});

export { router as showOrderRouter };
