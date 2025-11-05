const { getAllPayments, CreatePayment } = require('../../controller/paymentController');
const paymentService = require('../../service/paymentService');

// Mock the paymentService
jest.mock('../../service/paymentService');

describe('Payment Controller', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {},
      user: { id: 'user123', username: 'testuser' }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('createPayment', () => {
    it('should create a payment successfully', async () => {
      const paymentData = {
        amount: 100,
        currency: 'USD',
        serviceProvider: 'Test Provider',
        accountNumber: '1234567890',
        branchCode: '123456',
        accountType: 'Savings',
        accountHolderName: 'John Doe',
        swiftCode: 'ABCDUS33'
      };

      req.body = paymentData;
      const mockPayment = { id: 'payment123', ...paymentData, status: 'pending' };
      paymentService.CreatePayment.mockResolvedValue(mockPayment);

      await CreatePayment(req, res);

      expect(paymentService.CreatePayment).toHaveBeenCalledWith(req.user, paymentData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPayment);
    });

    it('should handle payment creation errors', async () => {
      req.body = { amount: 100 };
      paymentService.CreatePayment.mockRejectedValue(new Error('Invalid payment data'));

      await CreatePayment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid payment data'
      });
    });
  });

  describe('getAllPayments', () => {
    it('should get user payments successfully', async () => {
      const mockPayments = [
        { id: 'payment1', amount: 100, status: 'pending' },
        { id: 'payment2', amount: 200, status: 'completed' }
      ];

      paymentService.getAllPayments.mockResolvedValue(mockPayments);

      await getAllPayments(req, res);

      expect(paymentService.getAllPayments).toHaveBeenCalledWith(req.user);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPayments);
    });

    it('should handle errors when getting payments', async () => {
      paymentService.getAllPayments.mockRejectedValue(new Error('Database error'));

      await getAllPayments(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Database error'
      });
    });
  });
});
