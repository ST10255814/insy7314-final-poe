const { client } = require('../database/db');
const { ObjectId } = require('mongodb');

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

module.exports = { getAllPayments };