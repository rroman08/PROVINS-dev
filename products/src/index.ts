import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';

// This index.ts file is the entry point for the products service
// It connects to the database, sets up the NATS client, and starts the express server
const start = async () => {
  console.log('Products service starting up...');
  
  // Check if the required environment variables are set
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY is undefined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is undefined');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID is undefined');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID is undefined');
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL is undefined');
  }

  // Connect to NATS
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID, 
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    // Gracefully close the NATS connection on process exit
    natsWrapper.client.on('close', () => {
      console.log('Closing NATS connection');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    // Set up the event listeners for order:created and order:cancelled events
    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
  }
  
  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

start();
