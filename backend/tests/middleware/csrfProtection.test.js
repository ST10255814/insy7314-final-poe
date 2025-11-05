const { setCSRFToken, validateCSRF } = require('../../middleware/csrfProtection');

describe('CSRF Protection Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      method: 'POST',
      url: '/test',
      cookies: {},
      headers: {},
      body: {}
    };

    res = {
      cookie: jest.fn(),
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {}
    };

    next = jest.fn();

    // Clear console mocks
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('setCSRFToken', () => {
    it('should generate and set new CSRF token when none exists', () => {
      setCSRFToken(req, res, next);

      expect(res.cookie).toHaveBeenCalledWith('csrf-token', expect.any(String), {
        httpOnly: false,
        secure: true,
        sameSite: 'strict',
        maxAge: 3600000,
        path: '/'
      });

      expect(res.setHeader).toHaveBeenCalledWith('X-CSRF-Token', expect.any(String));
      expect(res.locals.csrfToken).toBeDefined();
      expect(req.csrfToken).toBeDefined();
      expect(next).toHaveBeenCalled();
    });

    it('should use existing CSRF token from cookies', () => {
      const existingToken = 'existing-token-12345';
      req.cookies['csrf-token'] = existingToken;

      setCSRFToken(req, res, next);

      expect(res.cookie).not.toHaveBeenCalled();
      expect(res.setHeader).toHaveBeenCalledWith('X-CSRF-Token', existingToken);
      expect(res.locals.csrfToken).toBe(existingToken);
      expect(req.csrfToken).toBe(existingToken);
      expect(next).toHaveBeenCalled();
    });

    it('should handle errors gracefully', () => {
      const error = new Error('Test error');
      res.cookie = jest.fn(() => { throw error; });

      setCSRFToken(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('validateCSRF', () => {
    it('should skip validation for safe HTTP methods', () => {
      req.method = 'GET';
      validateCSRF(req, res, next);
      expect(next).toHaveBeenCalled();

      req.method = 'HEAD';
      validateCSRF(req, res, next);
      expect(next).toHaveBeenCalledTimes(2);

      req.method = 'OPTIONS';
      validateCSRF(req, res, next);
      expect(next).toHaveBeenCalledTimes(3);
    });

    it('should reject request when no cookie token exists', () => {
      validateCSRF(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'CSRF token missing',
        message: 'CSRF token not found in cookies'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject request when no submitted token exists', () => {
      req.cookies['csrf-token'] = 'valid-token';

      validateCSRF(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'CSRF token missing',
        message: 'CSRF token not found in headers or body'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should accept valid token from headers', () => {
      const token = 'valid-csrf-token';
      req.cookies['csrf-token'] = token;
      req.headers['x-csrf-token'] = token;

      validateCSRF(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should accept valid token from body', () => {
      const token = 'valid-csrf-token';
      req.cookies['csrf-token'] = token;
      req.body._csrf = token;

      validateCSRF(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should accept valid token from alternative header name', () => {
      const token = 'valid-csrf-token';
      req.cookies['csrf-token'] = token;
      req.headers['csrf-token'] = token;

      validateCSRF(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should reject mismatched tokens', () => {
      req.cookies['csrf-token'] = 'cookie-token';
      req.headers['x-csrf-token'] = 'different-token';

      validateCSRF(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'CSRF token mismatch',
        message: 'CSRF tokens do not match'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should prefer header token over body token', () => {
      const correctToken = 'correct-token';
      const wrongToken = 'wrong-token';

      req.cookies['csrf-token'] = correctToken;
      req.headers['x-csrf-token'] = correctToken;
      req.body._csrf = wrongToken;

      validateCSRF(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should handle missing body gracefully', () => {
      const token = 'valid-token';
      req.cookies['csrf-token'] = token;
      req.headers['x-csrf-token'] = token;
      req.body = undefined;

      validateCSRF(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
