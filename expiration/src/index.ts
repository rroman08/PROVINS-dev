import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

// index.ts starts the expiration service
// It connects to NATS and sets up the OrderCreatedListener
const start = async () => {
  console.log('Expiration service starting up...');
  
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID is undefined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID is undefined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL is undefined');
  }

  // Access the environment variables
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID, 
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    // Use natsWrapper.client to set up the connection
    natsWrapper.client.on('close', () => {
      console.log('Closing NATS connection');
      process.exit();
    });

    // Graceful shutdown of the NATS connection when the process is terminated
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.error(err);
  }
};

start();
