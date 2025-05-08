import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { 
  NotFoundError,
  requireAuth, 
  validateRequest, 
  BadRequestError,
  OrderStatus
} from '@provins/common';
import { body } from 'express-validator';

import { Product } from '../models/product';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

// Order expiration time is set to 10 minutes
// This means that if the order is not completed within this time frame,
// it will be automatically cancelled and the product will be released for sale again
const EXPIRATION_WINDOW_SECONDS = 10 * 60;

// This route handler is responsible for creating a new order
router.post('/api/orders', 
  requireAuth, 
  [
  body('productId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))  // Coupling: check if t is valid a mongoose id
    .withMessage('Provide a valid productId')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // Find the product the user wants to order in db
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      throw new NotFoundError();
    }

    // Check if the product is reserved already
    const isReserved = await product.isReserved();
    if (isReserved) {
      throw new BadRequestError('Product reserved already');
    }

    // Calculate an expiration for the order (how long it will be locked for)
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Create order and save it to db
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      product
    });
    await order.save();
    
  new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      product: {
        id: product.id,
        price: product.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
