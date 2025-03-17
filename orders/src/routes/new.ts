import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { 
  NotFoundError,
  requireAuth, 
  validateRequest, 
  OrderStatus, 
  BadRequestError
} from '@provins/common';
import { body } from 'express-validator';

import { Product } from '../models/product';
import { Order } from '../models/order';

const router = express.Router();

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
    const product = await Product.findById
    if (!product) {
      throw new NotFoundError();
    }

    // Check if the product is reserved already
    const orderReserved = await Order.findOne({
      product: product,
      status: {
        $in: [
          OrderStatus.Created,
          OrderStatus.AwaitingPayment,
          OrderStatus.Complete
        ]
      }
    });
    if (orderReserved) {
      throw new BadRequestError('Product reserved already');
    }

    // Calculate an expiration for the order (how long it will be locked for)

    // Create order and save it to db
    
    // Publish event that order was created

    res.send({});
  }
);

export { router as createOrderRouter };
