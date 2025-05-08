import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

// This file sets up the testing environment for the auth service
// It uses MongoMemoryServer to create an in-memory MongoDB instance

// Declare a global variable for the signup function
// TypeScript requires the declaration of the type of global variables
declare global {
  var signup: () => Promise<string[]>;
}

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
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  } 
});


// This function runs after all tests
// It stops the MongoMemoryServer and closes the mongoose connection to prevent memory leaks
afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

// This function is used to sign up a user for testing purposes
// It sends a POST request to the '/api/users/signup' endpoint with a test email and password
global.signup = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201);

  // The response contains a Set-Cookie header
  // The cookie is used to authenticate the user for follow-up requests
  const cookie = response.get('Set-Cookie');

  if (!cookie) {
    throw new Error('Failed to get cookie from response');
  } 
  
  return cookie 
}
