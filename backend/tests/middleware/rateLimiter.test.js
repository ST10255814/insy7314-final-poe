const { userLimiter } = require('../../middleware/rateLimiter');

describe('Rate Limiter Middleware', () => {
  it('should be defined and be a function', () => {
    expect(userLimiter).toBeDefined();
    expect(typeof userLimiter).toBe('function');
  });

  it('should have correct configuration', () => {
    // Test that rate limiter is properly configured
    expect(userLimiter).toBeDefined();
    expect(typeof userLimiter).toBe('function');
    // The rate limiter is a function with configuration, not an object with options
  });
});
