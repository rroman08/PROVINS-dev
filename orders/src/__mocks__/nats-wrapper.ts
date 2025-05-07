// This file mocks the NATS wrapper so that client does not need to connect 
// to a real NATS server.
export const natsWrapper = {
  client: {
    publish: jest.fn().mockImplementation(
      (subject: string, data: string, callback: () => void) => {
      callback();
      }
    ),
  }
};
