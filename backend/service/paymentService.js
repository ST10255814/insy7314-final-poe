
const { client } = require('../database/db');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

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

//create payment
async function CreatePayment(user, data) {
    try {
        const db = client.db('INSY7314-POE');
        const PaymentsCollection = db.collection('Payments');

        //validate payment amount
        if (data.amount <= 0) {
            throw new Error("Payment amount must be greater than zero");
        }

        //validate currency
        const validCurrencies = ['USD', 'EUR', 'GBP', 'ZAR'];
        if (!validCurrencies.includes(data.currency)) {
            throw new Error(`Invalid currency. Supported currencies are: ${validCurrencies.join(", ")}`);
        }

        //validate account number format
        const ACCOUNTNUMBER_REGEX = /^[0-9]+$/;

        if (!ACCOUNTNUMBER_REGEX.test(data.accountNumber)) {
            throw new Error("Invalid account number format. Account number must be numeric.");
        }

        //validate swift code format
        const SWIFTCODE_REGEX = /^[A-Za-z]{6}[A-Za-z0-9]{2}([A-Za-z0-9]{3})?$/;

        if (!SWIFTCODE_REGEX.test(data.swiftCode)) {
            throw new Error("Invalid SWIFT code format.");
        }

        //hash account number before storage
        //salt account number before storage
        const salt = await bcrypt.genSalt(10);
        const hashedAccountNumber = await bcrypt.hash(data.accountNumber, salt);

        const accountInformation = {
            accountNumber: hashedAccountNumber,
            branchCode: data.branchCode,
            accountType: data.accountType,
            accountHolderName: data.accountHolderName,
            swiftCode: data.swiftCode
        };

        const newPayment = {
            userId: toObjectId(user.id),
            amount: data.amount,
            currency: data.currency,
            serviceProvider: data.serviceProvider,
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