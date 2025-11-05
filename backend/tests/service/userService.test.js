// Mock the database module before requiring userService
jest.mock('../../database/db', () => ({
  client: {
    db: jest.fn(() => ({
      collection: jest.fn(() => ({
        findOne: jest.fn(),
        insertOne: jest.fn(),
        updateOne: jest.fn(),
        deleteOne: jest.fn()
      }))
    }))
  }
}));

// Mock bcrypt
jest.mock('bcrypt', () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn()
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));

const { loginUser, registerUser } = require('../../service/userService');
const { ObjectId } = require('mongodb');
const { client } = require('../../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

describe('User Service', () => {
  let usersCollection;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup database mock
    usersCollection = {
      findOne: jest.fn(),
      insertOne: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn()
    };

    client.db.mockReturnValue({
      collection: jest.fn().mockReturnValue(usersCollection)
    });
  });

  describe('registerUser', () => {
    const userData = {
      username: 'testuser',
      password: 'Password123!',
      fullName: 'Test User',
      idNumber: '1234567890123',
      accountNumber: '1234567890'
    };

    it('should create a new user successfully', async () => {
      const hashedPassword = 'hashedpassword123';
      const mockInsertResult = {
        insertedId: new ObjectId(),
        acknowledged: true
      };

      usersCollection.findOne.mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue(hashedPassword);
      usersCollection.insertOne.mockResolvedValue(mockInsertResult);

      const result = await registerUser(userData);

      expect(result).toEqual({
        id: mockInsertResult.insertedId,
        fullName: 'Test User',
        username: 'testuser',
        message: 'User registered successfully'
      });
    });

    it('should throw error if username already exists', async () => {
      const existingUser = { username: 'testuser' };
      usersCollection.findOne.mockResolvedValue(existingUser);

      await expect(registerUser(userData)).rejects.toThrow('Username already exists');
      expect(usersCollection.insertOne).not.toHaveBeenCalled();
    });

    it('should login user successfully with valid credentials', async () => {
      const userData = {
        username: 'testuser',
        password: 'Password123!',
        accountNumber: '1234567890'
      };

      const mockUser = {
        _id: new ObjectId(),
        username: 'testuser',
        fullName: 'Test User',
        password: 'hashedpassword',
        accountNumber: '1234567890'
      };

      const mockToken = 'mock.jwt.token';

      usersCollection.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue(mockToken);

      const result = await loginUser(userData);

      expect(result).toEqual({
        id: mockUser._id.toString(),
        username: 'testuser',
        fullName: 'Test User',
        token: mockToken
      });
    });

    it('should handle database errors during user creation', async () => {
      usersCollection.findOne.mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedpassword');
      usersCollection.insertOne.mockRejectedValue(new Error('Database error'));

      await expect(registerUser(userData)).rejects.toThrow();
    });
  });

  describe('loginUser', () => {
    it('should login user successfully with valid credentials', async () => {
      const userData = {
        username: 'testuser',
        password: 'Password123!',
        accountNumber: '1234567890'
      };

      const mockUser = {
        _id: new ObjectId(),
        username: 'testuser',
        fullName: 'Test User',
        password: 'hashedpassword',
        accountNumber: '1234567890'
      };

      const mockToken = 'mock.jwt.token';

      usersCollection.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue(mockToken);

      const result = await loginUser(userData);

      expect(result).toEqual({
        id: mockUser._id.toString(),
        username: 'testuser',
        fullName: 'Test User',
        token: mockToken
      });
    });

    it('should throw error for invalid credentials', async () => {
      const userData = {
        username: 'testuser',
        password: 'wrongpassword',
        accountNumber: '1234567890'
      };

      usersCollection.findOne.mockResolvedValue(null);

      await expect(loginUser(userData)).rejects.toThrow();
    });
  });
});
