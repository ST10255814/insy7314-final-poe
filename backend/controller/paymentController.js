//Services to be used 
const paymentService = require('../service/paymentService')

exports.getAllPayments = async(req, res) =>{ 
    try{
        const user = req.user; // Retrieved from checkAuth middleware
        console.log(`Fetching payments for user: ${user.id}`);
        const payments = await paymentService.getAllPayments(user.id)
        res.status(200).json(payments)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}

// create Payment
exports.CreatePayment = async (req, res) => {
    try {
        const user = req.user; // Retrieved from checkAuth middleware
        console.log(`Creating payment for user: ${user.id}`);
        const paymentData = req.body;
        const paymentIntent = await paymentService.CreatePayment(user, paymentData);
        res.status(200).json(paymentIntent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

