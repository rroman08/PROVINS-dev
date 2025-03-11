import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { 
  errorHandler, 
  NotFoundError, 
  currentUser 
} from '@provins/common';

import { createProductRouter } from './routes/new';
import { showProductRouter } from './routes/show';
import { indexProductRouter } from './routes/index';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({ 
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
);
app.use(currentUser);

app.use(createProductRouter);
app.use(showProductRouter);
app.use(indexProductRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
