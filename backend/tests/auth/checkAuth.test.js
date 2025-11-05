const { checkAuth } = require('../../auth/checkAuth');

// Mock the jwt module
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn()
}));

describe('checkAuth Middleware', () => {
  let req, res, next, jwt;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    jwt = require('jsonwebtoken');

    req = {
      cookies: {},
      headers: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      clearCookie: jest.fn()
    };

    next = jest.fn();
  });

  describe('Token validation', () => {
    it('should pass authentication with valid token in cookies', async () => {
      const mockUser = { id: 'user123', username: 'testuser' };
      req.cookies.authToken = 'validtoken';
      jwt.verify.mockReturnValue(mockUser);

      await checkAuth(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith('validtoken', process.env.JWT_SECRET);
      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });

    it('should reject request when no token provided', async () => {
      await checkAuth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Access denied. No token provided.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject request with invalid token', async () => {
      req.cookies.authToken = 'invalidtoken';
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await checkAuth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Your session is expired. Please login again.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle JWT verification errors gracefully', async () => {
      req.cookies.authToken = 'expiredtoken';
      jwt.verify.mockImplementation(() => {
        const error = new Error('Token expired');
        error.name = 'TokenExpiredError';
        throw error;
      });

      await checkAuth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Your session is expired. Please login again.'
      });
    });
  });
});
