import mongoose from 'mongoose';

import { app } from './app';

// This index.ts starts the authentication service and connects to the database
const start = async () => {
  console.log('Auth service starting up...');
  
  // Check if the environment variables are set
  // JWT_KEY is used for signing JWT tokens
  // MONGO_URI is the connection string for the MongoDB database
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY is NOT defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is NOT defined');
  }

  // Connect to the MongoDB database using mongoose
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.error(err);
  }
  console.log('MongoDB connected');

  // Start the server and listen on port 3000
  app.listen(3000, () => {
    console.log('Auth service listening on port 3000');
  });
};

start();
