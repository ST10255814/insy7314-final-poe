const { getPendingPayments, verifySwiftCode, submitToSwift } = require('../../controller/employeeController');

// Mock the payment service
jest.mock('../../service/paymentService', () => ({
  getPendingPayments: jest.fn(),
  verifySwiftCode: jest.fn(),
  submitToSwift: jest.fn()
}));

const paymentService = require('../../service/paymentService');

describe('Employee Controller', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {},
      params: {},
      user: { id: 'employee123', username: 'employee' }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('getPendingPayments', () => {
    it('should get pending payments successfully', async () => {
      const mockPayments = [
        { id: 'payment1', amount: 1000, status: 'pending' },
        { id: 'payment2', amount: 2000, status: 'pending' }
      ];

      paymentService.getPendingPayments.mockResolvedValue(mockPayments);

      await getPendingPayments(req, res);

      expect(paymentService.getPendingPayments).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPayments);
    });

    it('should handle errors when getting pending payments', async () => {
      paymentService.getPendingPayments.mockRejectedValue(new Error('Database error'));

      await getPendingPayments(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Database error'
      });
    });
  });

  describe('verifySwiftCode', () => {
    it('should verify SWIFT code successfully', async () => {
      req.params.paymentId = 'payment123';
      req.body = { swiftCode: 'ABCDUS33' };

      const mockResult = { success: true, message: 'SWIFT code verified' };
      paymentService.verifySwiftCode.mockResolvedValue(mockResult);

      await verifySwiftCode(req, res);

      expect(paymentService.verifySwiftCode).toHaveBeenCalledWith('payment123', 'ABCDUS33');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle verification errors', async () => {
      req.params.paymentId = 'payment123';
      req.body = { swiftCode: 'INVALID' };

      paymentService.verifySwiftCode.mockRejectedValue(new Error('Invalid SWIFT code'));

      await verifySwiftCode(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid SWIFT code'
      });
    });
  });

  describe('submitToSwift', () => {
    describe('submitToSwift', () => {
    it('should submit to SWIFT successfully', async () => {
      req.params.paymentId = 'payment123';
      
      const mockResult = { success: true, message: 'Payment submitted to SWIFT' };
      paymentService.submitToSwift.mockResolvedValue(mockResult);

      await submitToSwift(req, res);

      expect(paymentService.submitToSwift).toHaveBeenCalledWith('payment123', req.user);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle submission errors', async () => {
      req.params.paymentId = 'payment123';
      
      paymentService.submitToSwift.mockRejectedValue(new Error('Submission failed'));

      await submitToSwift(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Submission failed'
      });
    });
  });
});
