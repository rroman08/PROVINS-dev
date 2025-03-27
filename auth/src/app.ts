import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@provins/common';

import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';

// This file is the main entry point for the application
// It sets up the express application, middleware, and routes
// It also handles errors and not found routes
// It is built using TypeScript and Express.js
// It uses cookie-session for session management
// It application uses express-async-errors for handling async errors

const app = express();
// This is a proxy for the ingress-nginx controller
// It is used to handle SSL termination and forwarding requests to the application
// It is used in the Kubernetes cluster to handle incoming requests
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({ 
    // This is used to store the session in a cookie
    signed: false,  // This is used to sign the cookie
    secure: process.env.NODE_ENV !== 'test'
  })
);

// Wiring up the routes in the app
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

// This is used to handle all other routes that are not found
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

// This is used to handle errors in the app
app.use(errorHandler);

export { app };
