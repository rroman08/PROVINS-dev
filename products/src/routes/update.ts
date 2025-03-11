import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
    validateRequest,
    NotFoundError,
    requireAuth,
    NotAuthorisedError,
} from '@provins/common';

import { Product } from '../models/product';

const router = express.Router();

router.put('/api/products/:id', requireAuth, async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new NotFoundError();
    }

    res.send(product);
});

export { router as updateProductRouter };
