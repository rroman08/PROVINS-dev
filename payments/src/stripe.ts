import Stripe from 'stripe';

// This file is used to initialise the Stripe client with the secret key

// Ensure that the STRIPE_KEY environment variable is set
if (!process.env.STRIPE_KEY) {
  throw new Error('Missing Stripe key');
}

// create a new Stripe instance with the secret key
const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: '2025-02-24.acacia',
});

export default stripe;
