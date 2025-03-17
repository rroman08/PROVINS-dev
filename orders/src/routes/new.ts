import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@provins/common';
import { body } from 'express-validator';



const router = express.Router();

router.post('/api/orders', 
  requireAuth, 
  [
  body('productId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))  // Is is a valid mongo id? COUPLING!!!
    .withMessage('Provide a valid productId')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
  res.send({});
});

export { router as createOrderRouter };
