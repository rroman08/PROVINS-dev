import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// This file sets up the testing environment for the auth service
// It uses MongoMemoryServer to create an in-memory MongoDB instance

// Declare a global variable for the signup function
// TypeScript requires the declaration of the type of global variables
declare global {
  var signup: (id?: string) => string[];
}

// Requies the mock nats-wrapper implementation
jest.mock('../nats-wrapper');

let mongo: any;

// This function runs before all tests
beforeAll(async () => {
  process.env.JWT_KEY! = 'testtesttest';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

// This function runs before each test
// It clears the database for each test
beforeEach(async () => {
  jest.clearAllMocks();
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  } 
});

// This ensures that each test starts with a clean state after each test
afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

// This function is used to sign up a user for testing purposes
// It mocks the signup process and returns a JWT token
global.signup = (id?: string) => {  // ? means optional argument argument
  // Build a JWT payload. { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),  // if id is not provided, generate a new one
    email: 'test@test.com'
  };
  
  // Create the JWT for authentication
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
