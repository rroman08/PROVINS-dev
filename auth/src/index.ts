import mongoose from 'mongoose';

import { app } from './app';

// This index.ts file is the entry point for the auth service
// It is responsible for starting the service and connecting to the database
// It imports the app file and starts the server
const start = async () => {
  // Check if the environment variables are set
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
