const { checkEmployeeAuth } = require('../../auth/checkEmployeeAuth');

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn()
}));

const jwt = require('jsonwebtoken');

describe('checkEmployeeAuth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';

    req = {
      cookies: {},
      headers: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    next = jest.fn();
  });

  describe('Token validation', () => {
    it('should pass authentication with valid employee token', async () => {
      const mockEmployee = { id: 'employee123', username: 'employee', role: 'Employee' };
      req.cookies.authToken = 'validtoken';
      jwt.verify.mockReturnValue(mockEmployee);

      await checkEmployeeAuth(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith('validtoken', process.env.JWT_SECRET);
      expect(req.user).toEqual(mockEmployee);
      expect(next).toHaveBeenCalled();
    });

    it('should reject request when no token provided', async () => {
      await checkEmployeeAuth(req, res, next);

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

      await checkEmployeeAuth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Your session is expired. Please login again.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle JWT verification errors gracefully', async () => {
      req.cookies.authToken = 'expiredtoken';
      jwt.verify.mockImplementation(() => {
        throw new jwt.TokenExpiredError('Token expired', new Date());
      });

      await checkEmployeeAuth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Your session is expired. Please login again.'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});

