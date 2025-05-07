import nats, { Stan } from 'node-nats-streaming';

// NatsWrapper is a wrapper around the NATS client to manage the connection
// similar to a singleton pattern, it ensures that only one instance of the NATS client 
// is created and shared across the application
class NatsWrapper {
  private _client?: Stan;

  // The client property is a getter that returns the NATS client if it exists
  get client() {
    if (!this._client) {
      throw new Error('Must connect to NATS before it can be accessed');
    }

    return this._client;
  }

  // The connect method creates a new NATS client and connects to the NATS server
  // It takes NATS cluster ID, client ID, and URL as parameters and returns a promise that 
  // resolves when the connection is established
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

export const natsWrapper = new NatsWrapper();
