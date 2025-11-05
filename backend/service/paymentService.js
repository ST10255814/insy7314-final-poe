const { client } = require('../database/db');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const { validateAndSanitize, validateAmount, VALIDATION_PATTERNS } = require('../utils/validation');

function toObjectId(id) {
  if (id instanceof ObjectId) return id;
  if (typeof id === "string" && ObjectId.isValid(id)) {
    return new ObjectId(id);
  }
  throw new Error("Invalid id format: must be a valid ObjectId string");
}

async function getAllPayments(user){
  try {
    const db = client.db('INSY7314-POE');
    const PaymentsCollection = db.collection('Payments');
    const payments = await PaymentsCollection.find({ userId: toObjectId(user.id) }).toArray();
    console.log(`Payments fetched for user ${user.id}: ${JSON.stringify(payments, null, 2)}`);
    return payments;
  } catch (error) {
    console.error(`Error fetching payments for user ${user.id}: ${error.message}`);
    throw new Error('Error fetching payments');
  }
}

async function CreatePayment(user, data) {
    try {
        const db = client.db('INSY7314-POE');
        const PaymentsCollection = db.collection('Payments');

        // Validate and sanitize all payment inputs
        const amount = validateAmount(data.amount, VALIDATION_PATTERNS.AMOUNT);
        const currency = validateAndSanitize('Currency', data.currency, VALIDATION_PATTERNS.CURRENCY);
        const serviceProvider = validateAndSanitize('Service Provider', data.serviceProvider, VALIDATION_PATTERNS.SERVICEPROVIDER);
        const accountNumber = validateAndSanitize('Account Number', data.accountNumber, VALIDATION_PATTERNS.ACCOUNTNUMBER);
        const branchCode = validateAndSanitize('Branch Code', data.branchCode, VALIDATION_PATTERNS.BRANCHCODE);
        const accountType = validateAndSanitize('Account Type', data.accountType, VALIDATION_PATTERNS.ACCOUNTTYPE);
        const accountHolderName = validateAndSanitize('Account Holder Name', data.accountHolderName, VALIDATION_PATTERNS.ACCOUNTHOLDERNAME);
        const swiftCode = validateAndSanitize('SWIFT Code', data.swiftCode, VALIDATION_PATTERNS.SWIFTCODE);

        // Additional validation
        const validCurrencies = ['USD', 'EUR', 'GBP', 'ZAR'];
        if (!validCurrencies.includes(currency)) {
            throw new Error(`Invalid currency. Supported currencies are: ${validCurrencies.join(", ")}`);
        }

        // Hash account number before storage
        const salt = await bcrypt.genSalt(10);
        const hashedAccountNumber = await bcrypt.hash(accountNumber, salt);

        const accountInformation = {
            accountNumber: hashedAccountNumber,
            branchCode,
            accountType,
            accountHolderName,
            swiftCode
        };

        const newPayment = {
            userId: toObjectId(user.id),
            amount,
            currency,
            serviceProvider,
            accountInformation,
            status: 'pending',
            createdAt: new Date()
        };
        
        const result = await PaymentsCollection.insertOne(newPayment);
        console.log(`Payment intent created for user ${user.id}: ${JSON.stringify(newPayment, null, 2)}`);
        return { id: result.insertedId, ...newPayment };
    } catch (error) {
        console.error(`Error creating payment intent for user ${user.id}: ${error.message}`);
        throw new Error(error.message);
    }
}

async function getPendingPayments() {
    try {
        const db = client.db('INSY7314-POE');
        const PaymentsCollection = db.collection('Payments');
        const UsersCollection = db.collection('Users');
        
        // Get all payments with pending status
        const pendingPayments = await PaymentsCollection.find({ status: 'pending' }).toArray();
        
        // Enrich with user information
        const enrichedPayments = await Promise.all(
            pendingPayments.map(async (payment) => {
                const user = await UsersCollection.findOne({ _id: payment.userId });
                return {
                    ...payment,
                    customerName: user ? user.fullName : 'Unknown Customer',
                    customerUsername: user ? user.username : 'Unknown'
                };
            })
        );
        
        console.log(`Found ${enrichedPayments.length} pending payments`);
        return enrichedPayments;
    } catch (error) {
        console.error(`Error fetching pending payments: ${error.message}`);
        throw new Error('Error fetching pending payments');
    }
}

async function verifySwiftCode(paymentId, swiftCode) {
    try {
        const db = client.db('INSY7314-POE');
        const PaymentsCollection = db.collection('Payments');
        
        // Get the payment
        const payment = await PaymentsCollection.findOne({ _id: toObjectId(paymentId) });
        if (!payment) {
            throw new Error('Payment not found');
        }
        
        if (payment.status !== 'pending') {
            throw new Error('Payment is not in pending status');
        }
        
        // Validate SWIFT code format (basic validation)
        const swiftCodePattern = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
        if (!swiftCodePattern.test(swiftCode)) {
            throw new Error('Invalid SWIFT code format');
        }
        
        // Check if provided SWIFT code matches the one in payment
        if (payment.accountInformation.swiftCode !== swiftCode) {
            throw new Error('SWIFT code does not match payment information');
        }
        
        // Update payment status to verified
        const result = await PaymentsCollection.updateOne(
            { _id: toObjectId(paymentId) },
            { 
                $set: { 
                    status: 'verified',
                    verifiedAt: new Date(),
                    verifiedSwiftCode: swiftCode
                }
            }
        );
        
        if (result.matchedCount === 0) {
            throw new Error('Payment not found');
        }
        
        console.log(`Payment ${paymentId} SWIFT code verified successfully`);
        return { message: 'SWIFT code verified successfully', status: 'verified' };
    } catch (error) {
        console.error(`Error verifying SWIFT code: ${error.message}`);
        throw error;
    }
}

async function submitToSwift(paymentId, employee) {
    try {
        const db = client.db('INSY7314-POE');
        const PaymentsCollection = db.collection('Payments');
        
        // Get the payment
        const payment = await PaymentsCollection.findOne({ _id: toObjectId(paymentId) });
        if (!payment) {
            throw new Error('Payment not found');
        }
        
        if (payment.status !== 'verified') {
            throw new Error('Payment must be verified before submission to SWIFT');
        }
        
        // Update payment status to submitted
        const result = await PaymentsCollection.updateOne(
            { _id: toObjectId(paymentId) },
            { 
                $set: { 
                    status: 'submitted',
                    verifiedAt: new Date(),
                    verifiedBy: employee.username,
                }
            }
        );
        
        if (result.matchedCount === 0) {
            throw new Error('Payment not found');
        }

        return { 
            message: 'Payment verified', 
            status: 'verified',
        };
    } catch (error) {
        console.error(`Error submitting to SWIFT: ${error.message}`);
        throw error;
    }
}

async function getSubmittedPayments() {
    try {
        const db = client.db('INSY7314-POE');
        const PaymentsCollection = db.collection('Payments');
        const UsersCollection = db.collection('Users');
        
        // Get all payments with verified or submitted status
        const submittedPayments = await PaymentsCollection.find({ 
            status: { $in: ['verified', 'submitted'] } 
        }).toArray();
        
        // Enrich with user information
        const enrichedPayments = await Promise.all(
            submittedPayments.map(async (payment) => {
                const user = await UsersCollection.findOne({ _id: payment.userId });
                return {
                    ...payment,
                    customerName: user ? user.fullName : 'Unknown Customer',
                    customerUsername: user ? user.username : 'Unknown'
                };
            })
        );
        
        console.log(`Found ${enrichedPayments.length} submitted payments`);
        return enrichedPayments;
    } catch (error) {
        console.error(`Error fetching submitted payments: ${error.message}`);
        throw new Error('Error fetching submitted payments');
    }
}

//update payment status to sent to swift
async function markPaymentAsSentToSwift(paymentId) {
    try{
        const db = client.db('INSY7314-POE');
        const PaymentsCollection = db.collection('Payments');

        const payment = await PaymentsCollection.findOne({ _id: toObjectId(paymentId) });

        if(!payment){
            throw new Error('Payment not found');
        }

        if(payment.status !== 'verified'){
            throw new Error('Payment must be verified before it can be sent to SWIFT');
        }

        const result = await PaymentsCollection.updateOne(
            { _id: toObjectId(paymentId) },
            {
                $set: {
                    status: 'submitted',
                    sentToSwiftAt: new Date(),
                    swiftTransactionId: `SWIFT${Date.now()}${Math.floor(Math.random() * 1000)}`, // Simulated SWIFT transaction ID
                    submittedAt: new Date(),
                    submittedBy: payment.verifiedBy
                }
            }
        );

        if (result.matchedCount === 0) {
            throw new Error('Payment not found');
        }

        console.log(`Payment ${paymentId} marked as sent to SWIFT successfully`);
        return { message: 'Payment successfully sent to SWIFT portal', status: 'submitted' };
    }catch(error){
        console.error(`Error marking payment as sent to SWIFT: ${error.message}`);
        throw new Error('Error marking payment as sent to SWIFT');
    }
}

module.exports = { getAllPayments, CreatePayment, getPendingPayments, verifySwiftCode, submitToSwift, getSubmittedPayments, markPaymentAsSentToSwift };