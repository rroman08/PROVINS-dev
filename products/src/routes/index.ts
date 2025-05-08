import express, { Request, Response } from 'express';

import { Product } from '../models/product';

const router = express.Router();

// This route will return all products that are not reserved
// It is used to display the list of products available for purchase
router.get('/api/products', async (req: Request, res: Response) => {
  const products = await Product.find({
    // Only get products that are not reserved
    orderId: undefined, 
  });

  res.send(products);
});

export { router as indexProductRouter };
