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

// This route is responsible for creating a charge
// It will be called when a user wants to pay for an order

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

    // Find the order by id that was extracted from the request body
    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    // Check if current user is the same as the order user
    // (important because it prevents users from paying for other users' orders)
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorisedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for cancelled order');
    }
    
    // Use the stripe library to create a charge
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
