//Services to be used 
const paymentService = require('../service/paymentService');
const { sanitizeInput } = require('../utils/validation');

exports.getAllPayments = async(req, res) =>{ 
    try{
        const user = req.user; // Retrieved from checkAuth middleware
        console.log(`Fetching payments for user: ${user.id}`);
        const payments = await paymentService.getAllPayments(user);
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.CreatePayment = async (req, res) => {
    try {
        const user = req.user; // Retrieved from checkAuth middleware
        
        // Sanitize all input fields
        const sanitizedPaymentData = {};
        for (const [key, value] of Object.entries(req.body)) {
            sanitizedPaymentData[key] = sanitizeInput(value);
        }
        
        console.log(`Creating payment for user: ${user.id}`);
        const paymentIntent = await paymentService.CreatePayment(user, sanitizedPaymentData);
        res.status(200).json(paymentIntent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.UpdatePaymentStatus = async (req, res) => {
    try { // Retrieved from checkAuth middleware
        const { paymentId } = req.params;

       await paymentService.markPaymentAsSentToSwift(paymentId);
       res.status(200).json({ message: 'Payment status updated to sent to SWIFT' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
