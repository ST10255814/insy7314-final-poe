const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');

let mongod;
let client;

// Setup before all tests
beforeAll(async () => {
  // Start MongoDB Memory Server
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  // Connect to the in-memory database
  client = new MongoClient(uri);
  await client.connect();

  // Set up global variables for tests
  global.__MONGO_URI__ = uri;
  global.__MONGO_DB_NAME__ = 'test-db';
  global.__MONGO_CLIENT__ = client;
});

// Clean up after all tests
afterAll(async () => {
  await client.close();
  await mongod.stop();
});

// Clean up after each test
afterEach(async () => {
  const collections = await client.db('test-db').collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// Mock console methods to reduce test output noise
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};
