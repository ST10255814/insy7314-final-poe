// Mock the database connection before importing anything else
jest.mock('../../database/db', () => ({
  client: {
    db: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({
        find: jest.fn().mockReturnValue({ toArray: jest.fn() }),
        findOne: jest.fn(),
        insertOne: jest.fn(),
        updateOne: jest.fn()
      })
    })
  },
  connectMongo: jest.fn()
}));

const userRoutes = require('../../auth/user');

describe('User Routes', () => {
  it('should export a router', () => {
    expect(userRoutes).toBeDefined();
    expect(typeof userRoutes).toBe('function');
  });

  it('should be a valid Express router', () => {
    expect(userRoutes.stack).toBeDefined();
    expect(Array.isArray(userRoutes.stack)).toBe(true);
  });

  it('should have middleware and routes configured', () => {
    // Check that the router has some routes configured
    expect(userRoutes.stack.length).toBeGreaterThan(0);
  });
});
