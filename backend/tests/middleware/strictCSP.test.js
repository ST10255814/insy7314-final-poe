const { strictCSP } = require('../../middleware/strictCSP');

describe('Strict CSP Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
      method: 'GET',
      url: '/test'
    };

    res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      locals: {}
    };

    next = jest.fn();
  });

  it('should be defined and be a function', () => {
    expect(strictCSP).toBeDefined();
    expect(typeof strictCSP).toBe('function');
  });

  it('should set Content Security Policy headers', () => {
    strictCSP(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith(
      'Content-Security-Policy',
      expect.stringContaining('default-src \'self\'')
    );
    expect(next).toHaveBeenCalled();
  });

  it('should handle different request methods', () => {
    req.method = 'POST';

    strictCSP(req, res, next);

    expect(res.setHeader).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
