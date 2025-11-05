const httpsRedirect = require('../../middleware/httpsRedirect');

describe('HTTPS Redirect Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
      url: '/test',
      get: jest.fn()
    };

    res = {
      redirect: jest.fn()
    };

    next = jest.fn();
  });  it('should be defined and be a function', () => {
    expect(httpsRedirect).toBeDefined();
    expect(typeof httpsRedirect).toBe('function');
  });

  it('should redirect HTTP to HTTPS in production', () => {
    process.env.NODE_ENV = 'production';
    req.headers['x-forwarded-proto'] = 'http';
    req.get.mockReturnValue('example.com');

    httpsRedirect(req, res, next);

    expect(res.redirect).toHaveBeenCalledWith(301, 'https://example.com/test');
    expect(next).not.toHaveBeenCalled();
  });

  it('should not redirect if already HTTPS', () => {
    process.env.NODE_ENV = 'production';
    req.headers['x-forwarded-proto'] = 'https';

    httpsRedirect(req, res, next);

    expect(res.redirect).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should not redirect in development', () => {
    process.env.NODE_ENV = 'development';
    req.headers['x-forwarded-proto'] = 'http';
    req.hostname = 'localhost';
    req.get.mockReturnValue('localhost:3000');

    httpsRedirect(req, res, next);

    expect(res.redirect).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
