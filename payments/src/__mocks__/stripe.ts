// This file mocks the Stripe library for testing purposes

const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({}),
  },
};

export default stripe;
