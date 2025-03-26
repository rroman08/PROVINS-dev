import Stripe from 'stripe';

if (!process.env.STRIPE_KEY) {
  throw new Error('Missing Stripe key');
}

const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: '2025-02-24.acacia',
});

export default stripe;
