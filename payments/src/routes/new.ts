import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { 
  requireAuth, 
  validateRequest, 
  BadRequestError, 
  NotAuthorisedError,
  NotFoundError, 
  OrderStatus
} from '@provins/common';

import { Order } from '../models/order';
// import { Payment } from '../models/payment';

const router = express.Router();

router.post('/api/payments', requireAuth,
  [
    body('token')
      .not()
      .isEmpty()
      .withMessage('Token required'),
    body('orderId')
      .not()
      .isEmpty()
      .withMessage('Order ID required')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorisedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for cancelled order');
    }

    res.send({ success: true });
  }
);  

export { router as createChargeRouter };
