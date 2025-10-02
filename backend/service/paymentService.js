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

module.exports = { getAllPayments, CreatePayment };