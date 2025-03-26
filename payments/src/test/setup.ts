import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  var signup: (id?: string) => string[];
}

jest.mock('../nats-wrapper');

process.env.STRIPE_KEY = 'sk_test_51R6sbk4JmgAK3URjztYzmv8ozKl7TN9CA6a8ZERYgMJY8zjNRcrvwXQA2ySJPqnbGtT3vYVCgoDZDdjQWXppJR4n00bfIAUa12';

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY! = 'testtesttest';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  } 
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signup = (id?: string) => {  // ? means optional argument argument
  // Build a JWT payload. { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),  // if id is not provided, generate a new one
    email: 'test@test.com'
  };
  
  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object. { jwt: NEW_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string that's the cookie with the encoded data
  return [`session=${base64}`];
}
