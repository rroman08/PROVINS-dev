import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// setup for jest testing

// To declare it here as global is a workaround to avoid TypeScript errors
declare global {
  var signup: () => string[];
}

// Use mock for nats wrapper
jest.mock('../nats-wrapper');

let mongo: any;

// Before all tests, start up a new in-memory database
beforeAll(async () => {
  process.env.JWT_KEY! = 'testtesttest';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

// Clear all mocks and delete all collections before each test
beforeEach(async () => {
  jest.clearAllMocks();
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  } 
});

// Close the in-memory database after all tests so there is no memory leak
afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

// Handles the signup process for testing
// This function creates a new user and returns a cookie
// that can be used to authenticate the user in subsequent requests
global.signup = () => {
  // Build a JWT payload. { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
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
