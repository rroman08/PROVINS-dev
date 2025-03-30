import express, { Request, Response } from 'express';

import { Product } from '../models/product';

const router = express.Router();

router.get('/api/products', async (req: Request, res: Response) => {
  const products = await Product.find({
    orderId: undefined, // only get products that are not reserved
  });

  res.send(products);
});

export { router as indexProductRouter };
