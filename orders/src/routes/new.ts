import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { 
  NotFoundError,
  requireAuth, 
  validateRequest, 
  BadRequestError
} from '@provins/common';
import { body } from 'express-validator';

import { Product } from '../models/product';
import { Order, OrderStatus } from '../models/order';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 10 * 60;

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
    
    // Publish event that order was created

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
