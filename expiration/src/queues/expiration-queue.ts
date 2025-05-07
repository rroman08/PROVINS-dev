import Queue from 'bull';

import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';
import { natsWrapper } from '../nats-wrapper';


// Interface is needed to define data structure of payload for TypeScript
interface Payload {
  orderId: string;
}

// expirationQueue is a Bull queue that handles order expiration jobs
// It is used to process jobs that are added to the queue when an order is created
// Uses a Redis instance as the backend for the queue
const expirationQueue = new Queue<Payload>(
  'order:expiration', {
  redis: {
    host: process.env.REDIS_HOST
  }
});

// Process the jobs in the expiration queue
// When a job is processed, expiration:complete event is published
expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId
  });
});

export { expirationQueue };
