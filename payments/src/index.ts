import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';

// This index.ts starts the payments service, connects to NATS and MongoDB, and sets up the event listeners
const start = async () => {

  console.log('Payment service starting up...');

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

    // Close the NATS connection when the process is terminated
    natsWrapper.client.on('close', () => {
      console.log('Closing NATS connection');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    // Set up the event listeners for order creation and cancellation
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
