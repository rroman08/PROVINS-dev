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
import stripe from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

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
    
    const charge = await stripe.charges.create({
      currency: 'gbp',  // ISO currency code 'gbp'
      amount: order.price * 100,  // smallest currency unit
      source: token  // use token as source to be charged 
      // 'tok_visa' test token for stripe (always works)
    });

    // Save payment record
    const payment = Payment.build({
      orderId: orderId,
      stripeId: charge.id
    });
    await payment.save();

    // Publish payment created event
    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId
    });

    res.status(204).send({ id: payment.id });
  }
);  

export { router as createChargeRouter };
