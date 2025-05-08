import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// This is a global setup file for Jest tests
// It sets up a MongoDB in-memory server and a global function for signing up users
declare global {
  var signup: () => string[];
}

jest.mock('../nats-wrapper');

let mongo: any;

// beforeAll sets up the in-memory MongoDB server before all tests
beforeAll(async () => {
  process.env.JWT_KEY! = 'testtesttest';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

// beforeEach clears all mocks and deletes all collections in the 
// in-memory MongoDB server before each test
// This ensures that each test starts with a clean state
beforeEach(async () => {
  jest.clearAllMocks();
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  } 
});

// afterAll closes the in-memory MongoDB server after all tests
// This ensures that the server is properly shut down and all resources are released
afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

// This function is used to sign up a user and return a cookie
// that can be used to authenticate the user in tests
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
