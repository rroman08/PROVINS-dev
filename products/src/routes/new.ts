import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@provins/common';

import { Product } from '../models/product';
import { ProductCreatedPublisher } from '../events/publishers/product-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

// This route handles the creation of a new product
// It requires authentication and validates the request body
router.post(
  '/api/products', 
  requireAuth, [
    body('title').not().isEmpty().withMessage('Provice a title'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive value')
  ], 
  validateRequest, 
  async (req: Request, res: Response) => {
  
  const { title, price } = req.body;

  const product = Product.build({
    title,
    price,
    userId: req.currentUser!.id
  });
  await product.save();
  await new ProductCreatedPublisher(natsWrapper.client).publish({
    id: product.id,
    version: product.version,
    title: product.title,
    price: product.price,
    userId: product.userId
  });

  res.status(201).send(product);
});

export { router as createProductRouter };
