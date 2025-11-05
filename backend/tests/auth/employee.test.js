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

const employeeRoutes = require('../../auth/employee');

describe('Employee Routes', () => {
  it('should export a router', () => {
    expect(employeeRoutes).toBeDefined();
    expect(typeof employeeRoutes).toBe('function');
  });

  it('should be a valid Express router', () => {
    expect(employeeRoutes.stack).toBeDefined();
    expect(Array.isArray(employeeRoutes.stack)).toBe(true);
  });

  it('should have middleware and routes configured', () => {
    // Check that the router has some routes configured
    expect(employeeRoutes.stack.length).toBeGreaterThan(0);
  });
});
