import nats, { Stan } from 'node-nats-streaming';

// This class wraps the NATS client to provide a singleton instance for the application
class NatsWrapper {
  private _client?: Stan;

  // Getter for the NATS client
  get client() {
    if (!this._client) {
      throw new Error('Must connect to NATS before it can be accessed');
    }

    return this._client;
  }

  // Connect to NATS with the provided NATS cluster ID, client ID, and URL
  // This method returns a promise that resolves when the connection is established
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
