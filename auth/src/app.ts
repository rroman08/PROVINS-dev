import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@provins/common';

import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';


// This app is the main entry point to the auth service that is used in the index.ts file
// It sets up the express application, middleware, and routes
// It also handles errors and not found routes
// It is built using TypeScript and Express.js
// It uses cookie-session for session management

const app = express();

// This is used to trust the proxy for secure cookies
// It is used when the app is behind a reverse proxy like Nginx
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({ 
    // This is used to store the session in a cookie
    signed: false,
    secure: false
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
