import express, { Request, Response } from 'express';

import { Product } from '../models/product';

const router = express.Router();

// This route handler is used to get all products that are not reserved
// It is used by the client to display all available products
router.get('/api/products', async (req: Request, res: Response) => {
  const products = await Product.find({
    orderId: undefined, // only get products that are not reserved
  });

  res.send(products);
});

export { router as indexProductRouter };
