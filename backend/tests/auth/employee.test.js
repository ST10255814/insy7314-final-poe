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
