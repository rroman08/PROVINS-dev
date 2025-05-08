import express, { Request, Response } from 'express';
import { requireAuth } from '@provins/common';

import { Order } from '../models/order';

const router = express.Router();

// This route handler is responsible for fetching all orders for a specific user
// It uses the requireAuth middleware to ensure that the user is authenticated
router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id
  }).populate('product');

  res.send(orders);
});

export { router as indexOrderRouter };
