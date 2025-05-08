// This file is used to mock the nats-wrapper module for testing purposes

export const natsWrapper = {
  client: {
    publish: jest.fn().mockImplementation(
      (subject: string, data: string, callback: () => void) => {
      callback();
      }
    ),
  }
};
