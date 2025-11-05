const { registerUser, loginUser, logoutUser } = require('../../controller/userController');

// Mock the userService
jest.mock('../../service/userService', () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn()
}));

const userService = require('../../service/userService');

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));

describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {},
      user: { id: 'user123', username: 'testuser' }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis()
    };
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'newuser',
        password: 'Password123!',
        fullName: 'New User',
        idNumber: '1234567890123'
      };

      req.body = userData;
      const mockUserId = 'user456';
      userService.registerUser.mockResolvedValue(mockUserId);

      await registerUser(req, res);

      expect(userService.registerUser).toHaveBeenCalledWith(userData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUserId);
    });

    it('should handle registration errors', async () => {
      const userData = {
        username: 'existinguser',
        password: 'Password123!',
        fullName: 'Existing User',
        idNumber: '1234567890123'
      };

      req.body = userData;
      userService.registerUser.mockRejectedValue(new Error('Username already exists'));

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Username already exists'
      });
    });
  });

  describe('loginUser', () => {
    it('should login user successfully with valid credentials', async () => {
      const loginData = {
        username: 'testuser',
        password: 'Password123!',
        accountNumber: '1234567890'
      };

      const mockUser = {
        id: 'user123',
        username: 'testuser',
        fullName: 'Test User',
        token: 'mocktoken'
      };

      req.body = loginData;
      userService.loginUser.mockResolvedValue(mockUser);

      await loginUser(req, res);

      expect(userService.loginUser).toHaveBeenCalledWith(loginData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login successful',
        user: mockUser
      });
    });
  });

  describe('logoutUser', () => {

    it('should reject login with invalid username', async () => {
      req.body = {
        username: 'nonexistent',
        password: 'Password123!',
        accountNumber: '1234567890'
      };

      userService.loginUser.mockRejectedValue(new Error('Invalid credentials'));

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid credentials'
      });
    });

    it('should reject login with invalid password', async () => {
      req.body = {
        username: 'testuser',
        password: 'wrongpassword',
        accountNumber: '1234567890'
      };

      userService.loginUser.mockRejectedValue(new Error('Invalid credentials'));

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid credentials'
      });
    });
  });

  describe('logoutUser', () => {
    it('should logout user successfully', async () => {
      await logoutUser(req, res);

      expect(res.clearCookie).toHaveBeenCalledWith('authToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/'
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Logout successful - all tokens cleared'
      });
    });
  });
});
