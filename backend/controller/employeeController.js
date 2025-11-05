const paymentService = require('../service/paymentService');
const { sanitizeInput } = require('../utils/validation');

// Get all pending payments for employee review
exports.getPendingPayments = async (req, res) => {
  try {
    const employee = req.user; // Retrieved from checkEmployeeAuth middleware
    console.log(`Employee ${employee.username} fetching pending payments`);
    const pendingPayments = await paymentService.getPendingPayments();
    res.status(200).json(pendingPayments);
  } catch (error) {
    console.error(`Error fetching pending payments: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

// Verify SWIFT code for a payment
exports.verifySwiftCode = async (req, res) => {
  try {
    const employee = req.user;
    const { paymentId } = req.params;
    const { swiftCode } = req.body;

    // Sanitize inputs
    const sanitizedSwiftCode = sanitizeInput(swiftCode);

    console.log(`Employee ${employee.username} verifying SWIFT code for payment ${paymentId}`);
    const result = await paymentService.verifySwiftCode(paymentId, sanitizedSwiftCode);
    res.status(200).json(result);
  } catch (error) {
    console.error(`Error verifying SWIFT code: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

// Submit payment to SWIFT
exports.submitToSwift = async (req, res) => {
  try {
    const employee = req.user;
    const { paymentId } = req.params;

    console.log(`Employee ${employee.username} submitting payment ${paymentId} to SWIFT`);
    const result = await paymentService.submitToSwift(paymentId, employee);
    res.status(200).json(result);
  } catch (error) {
    console.error(`Error submitting to SWIFT: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

// Get all submitted payments (for tracking)
exports.getSubmittedPayments = async (req, res) => {
  try {
    const employee = req.user;
    console.log(`Employee ${employee.username} fetching submitted payments`);
    const submittedPayments = await paymentService.getSubmittedPayments();
    res.status(200).json(submittedPayments);
  } catch (error) {
    console.error(`Error fetching submitted payments: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
