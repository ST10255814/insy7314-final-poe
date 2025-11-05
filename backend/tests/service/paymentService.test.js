const { ObjectId } = require('mongodb');
const {
  getAllPayments,
  CreatePayment,
  getPendingPayments,
  verifySwiftCode,
  markPaymentAsSentToSwift
} = require('../../service/paymentService');

// Mock the database module
jest.mock('../../database/db', () => ({
  client: {
    db: jest.fn()
  }
}));

describe('PaymentService', () => {
  let db;
  let paymentsCollection;
  let usersCollection;
  let mockClient;

  beforeEach(() => {
    // Get the mocked client
    mockClient = require('../../database/db').client;

    // Set up mocks for each test
    paymentsCollection = {
      find: jest.fn(),
      findOne: jest.fn(),
      insertOne: jest.fn(),
      updateOne: jest.fn(),
      deleteMany: jest.fn(),
      toArray: jest.fn()
    };

    usersCollection = {
      findOne: jest.fn()
    };

    db = {
      collection: jest.fn((name) => {
        if (name === 'Payments') return paymentsCollection;
        if (name === 'Users') return usersCollection;
        return null;
      })
    };

    // Set up the mock client to return our mocked db
    mockClient.db.mockReturnValue(db);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPayments', () => {
    it('should fetch all payments for a user', async () => {
      const mockUser = { id: '507f1f77bcf86cd799439011' };
      const mockPayments = [
        { _id: new ObjectId(), userId: new ObjectId(mockUser.id), amount: 100, currency: 'USD' }
      ];

      paymentsCollection.find.mockReturnValue({
        toArray: jest.fn().mockResolvedValue(mockPayments)
      });

      const result = await getAllPayments(mockUser);

      expect(paymentsCollection.find).toHaveBeenCalledWith({
        userId: new ObjectId(mockUser.id)
      });
      expect(result).toEqual(mockPayments);
    });

    it('should throw error when database operation fails', async () => {
      const mockUser = { id: '507f1f77bcf86cd799439011' };

      paymentsCollection.find.mockReturnValue({
        toArray: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      await expect(getAllPayments(mockUser)).rejects.toThrow('Error fetching payments');
    });
  });

  describe('CreatePayment', () => {
    it('should create a payment with valid data', async () => {
      const mockUser = { id: '507f1f77bcf86cd799439011' };
      const mockPaymentData = {
        amount: '100.50',
        currency: 'USD',
        serviceProvider: 'Test Provider',
        accountNumber: '1234567890',
        branchCode: '123456',
        accountType: 'checking',
        accountHolderName: 'John Doe',
        swiftCode: 'ABCDUS33'
      };

      const mockInsertResult = {
        insertedId: new ObjectId()
      };

      paymentsCollection.insertOne.mockResolvedValue(mockInsertResult);

      const result = await CreatePayment(mockUser, mockPaymentData);

      expect(paymentsCollection.insertOne).toHaveBeenCalled();
      expect(result.id).toEqual(mockInsertResult.insertedId);
      expect(result.userId).toEqual(new ObjectId(mockUser.id));
      expect(result.amount).toBe(100.50);
      expect(result.status).toBe('pending');
    });

    it('should throw error for invalid currency', async () => {
      const mockUser = { id: '507f1f77bcf86cd799439011' };
      const invalidPaymentData = {
        amount: '100.50',
        currency: 'INVALID',
        serviceProvider: 'Test Provider',
        accountNumber: '1234567890',
        branchCode: '123456',
        accountType: 'checking',
        accountHolderName: 'John Doe',
        swiftCode: 'ABCDUS33'
      };

      await expect(CreatePayment(mockUser, invalidPaymentData))
        .rejects.toThrow('Invalid Currency format');
    });
  });

  describe('getPendingPayments', () => {
    it('should fetch pending payments with user information', async () => {
      const mockPayments = [
        {
          _id: new ObjectId(),
          userId: new ObjectId('507f1f77bcf86cd799439011'),
          status: 'pending',
          amount: 100
        }
      ];

      const mockUser = {
        _id: new ObjectId('507f1f77bcf86cd799439011'),
        fullName: 'John Doe',
        username: 'johndoe'
      };

      paymentsCollection.find.mockReturnValue({
        toArray: jest.fn().mockResolvedValue(mockPayments)
      });

      usersCollection.findOne.mockResolvedValue(mockUser);

      const result = await getPendingPayments();

      expect(paymentsCollection.find).toHaveBeenCalledWith({ status: 'pending' });
      expect(result[0].customerName).toBe('John Doe');
      expect(result[0].customerUsername).toBe('johndoe');
    });
  });

  describe('verifySwiftCode', () => {
    const mockPaymentId = '507f1f77bcf86cd799439011';
    const validSwiftCode = 'ABCDUS33';

    it('should verify SWIFT code successfully', async () => {
      const mockPayment = {
        _id: new ObjectId(mockPaymentId),
        status: 'pending',
        accountInformation: {
          swiftCode: validSwiftCode
        }
      };

      paymentsCollection.findOne.mockResolvedValue(mockPayment);
      paymentsCollection.updateOne.mockResolvedValue({ matchedCount: 1 });

      const result = await verifySwiftCode(mockPaymentId, validSwiftCode);

      expect(result.status).toBe('verified');
      expect(paymentsCollection.updateOne).toHaveBeenCalledWith(
        { _id: new ObjectId(mockPaymentId) },
        expect.objectContaining({
          $set: expect.objectContaining({
            status: 'verified',
            verifiedSwiftCode: validSwiftCode
          })
        })
      );
    });

    it('should throw error for invalid SWIFT code format', async () => {
      const mockPayment = {
        _id: new ObjectId(mockPaymentId),
        status: 'pending',
        accountInformation: { swiftCode: validSwiftCode }
      };

      paymentsCollection.findOne.mockResolvedValue(mockPayment);

      await expect(verifySwiftCode(mockPaymentId, 'INVALID'))
        .rejects.toThrow('Invalid SWIFT code format');
    });

    it('should throw error if payment not found', async () => {
      paymentsCollection.findOne.mockResolvedValue(null);

      await expect(verifySwiftCode(mockPaymentId, validSwiftCode))
        .rejects.toThrow('Payment not found');
    });

    it('should throw error if payment not in pending status', async () => {
      const mockPayment = {
        _id: new ObjectId(mockPaymentId),
        status: 'completed',
        accountInformation: { swiftCode: validSwiftCode }
      };

      paymentsCollection.findOne.mockResolvedValue(mockPayment);

      await expect(verifySwiftCode(mockPaymentId, validSwiftCode))
        .rejects.toThrow('Payment is not in pending status');
    });
  });

  describe('markPaymentAsSentToSwift', () => {
    const mockPaymentId = '507f1f77bcf86cd799439011';

    it('should mark payment as sent to SWIFT successfully', async () => {
      const mockPayment = {
        _id: new ObjectId(mockPaymentId),
        status: 'verified',
        verifiedBy: 'employee1'
      };

      paymentsCollection.findOne.mockResolvedValue(mockPayment);
      paymentsCollection.updateOne.mockResolvedValue({ matchedCount: 1 });

      const result = await markPaymentAsSentToSwift(mockPaymentId);

      expect(result.status).toBe('submitted');
      expect(paymentsCollection.updateOne).toHaveBeenCalledWith(
        { _id: new ObjectId(mockPaymentId) },
        expect.objectContaining({
          $set: expect.objectContaining({
            status: 'submitted'
          })
        })
      );
    });

    it('should throw error if payment not verified', async () => {
      const mockPayment = {
        _id: new ObjectId(mockPaymentId),
        status: 'pending'
      };

      paymentsCollection.findOne.mockResolvedValue(mockPayment);

      await expect(markPaymentAsSentToSwift(mockPaymentId))
        .rejects.toThrow('Payment must be verified before it can be sent to SWIFT');
    });
  });
});
