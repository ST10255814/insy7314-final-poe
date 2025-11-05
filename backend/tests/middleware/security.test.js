const { securityHeaders, requireHTTPS } = require('../../middleware/security');

describe('Security Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
      ip: '127.0.0.1',
      secure: false,
      get: jest.fn()
    };

    res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    next = jest.fn();
  });

  describe('securityHeaders', () => {
    it('should be defined and be a function', () => {
      expect(securityHeaders).toBeDefined();
      expect(typeof securityHeaders).toBe('function');
    });

    it('should set security headers', () => {
      securityHeaders(req, res, next);

      expect(res.setHeader).toHaveBeenCalledWith('X-API-Version', '1.0');
      expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      expect(next).toHaveBeenCalled();
    });

    it('should set HSTS header in production', () => {
      process.env.NODE_ENV = 'production';

      securityHeaders(req, res, next);

      expect(res.setHeader).toHaveBeenCalledWith('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
      expect(next).toHaveBeenCalled();
    });
  });

  describe('requireHTTPS', () => {
    it('should require HTTPS in production', () => {
      process.env.NODE_ENV = 'production';
      req.secure = false;
      req.get.mockReturnValue('http');

      requireHTTPS(req, res, next);

      expect(res.status).toHaveBeenCalledWith(426);
      expect(res.json).toHaveBeenCalledWith({
        error: 'HTTPS Required',
        message: 'This endpoint requires a secure connection'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should allow HTTPS requests in production', () => {
      process.env.NODE_ENV = 'production';
      req.secure = true;

      requireHTTPS(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
