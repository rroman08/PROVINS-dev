import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { 
  errorHandler, 
  NotFoundError, 
  currentUser 
} from '@provins/common';

import { createOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes/index';
import { cancelOrderRouter } from './routes/cancel';

// Create an Express application
// This is the main entry point for the orders service which is called in the index.ts file
// The app is created here and all the routes are wired up to it
const app = express();
app.set('trust proxy', true);  // trust the reverse proxy (nginx)
app.use(express.json());
// Set up cookie session middleware
// The cookie is not signed, so it can be read by the client
app.use(
  cookieSession({ 
    signed: false,
    secure: false
  })
);
// currentUser middleware will decode the JWT and set req.currentUser
app.use(currentUser);

// Wire up all the routes to the app
// Note: The order of middleware matters.
app.use(createOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(cancelOrderRouter);

// Handle 404 errors
// This middleware will be called if no other route matches
// It will throw a NotFoundError, which will be caught by the error handler
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

// Error handling middleware
// This middleware will be called if any of the routes throw an error
// It will catch the error and send a response to the client
app.use(errorHandler);

export { app };
