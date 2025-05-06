import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { ProductCreatedListener } from './events/listeners/product-created-listener';
import { ProductUpdatedListener } from './events/listeners/product-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';

// This is the main entry point for the orders service
const start = async () => {
  console.log('Orders service starting up...');

  // Check if the environment variables are set
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
  // This is the NATS streaming server that we are connecting to
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID, 
      process.env.NATS_CLIENT_ID, 
      process.env.NATS_URL
    );

    // This is the NATS client that we are using to connect to the NATS server
    natsWrapper.client.on('close', () => {
      console.log('Closing NATS connection');
      process.exit();
    });

    // This is used to gracefully shut down the NATS connection when the process is terminated
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    // Create the listeners for the events that the orders service is listening to
    new ProductCreatedListener(natsWrapper.client).listen();
    new ProductUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen(); 

    // Connect to MongoDB that the orders service is using
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
  }
  
  // Configures the port that the orders service will listen on 
  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

// Call the start function to start the orders service
start();
