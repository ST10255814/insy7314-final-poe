//Services to be used 
const paymentService = require('../service/paymentService')

exports.getAllPayments = async(_, res) =>{ 
    try {
        const payments = await paymentService.getAllPayments()
        console.log(``)
        
    } catch (error) {
        
    }

}
