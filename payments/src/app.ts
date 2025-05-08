import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { 
  errorHandler, 
  NotFoundError, 
  currentUser 
} from '@provins/common';

import { createChargeRouter } from './routes/new';


// This is the application entry point for the payments service
// It sets up the express application, middleware, and routes
// It also handles errors and authentication
const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({ 
    signed: false,
    secure: false
  })
);

// The currentUser middleware checks for a valid JWT in the cookie session
app.use(currentUser);
// The createChargeRouter handles the creation of new charges
app.use(createChargeRouter);
// The NotFoundError is thrown for any routes that are not found
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
