import nats, { Stan } from 'node-nats-streaming';

// This is the NATS streaming server that we are connecting to
// The NatsWrapper class is used to wrap the NATS client
class NatsWrapper {
  private _client?: Stan;

  // The client property is a getter that returns the NATS client
  // If the client is not defined, it throws an error
  get client() {
    if (!this._client) {
      throw new Error('Must connect to NATS before it can be accessed');
    }

    // Return the NATS client
    return this._client;
  }

  // The connect method is used to connect to the NATS server
  // It takes the cluster ID, client ID, and URL as arguments
  // It returns a promise that resolves when the connection is established
  // and rejects if there is an error
  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('NATS connected');
        resolve();
      });

      this.client.on('error', (err) => {
        reject(err);
      });
    });
  }
}

// Create an instance of the NatsWrapper class and export it
export const natsWrapper = new NatsWrapper();
