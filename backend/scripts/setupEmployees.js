const { client } = require('../database/db');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const salt = 10;
const db = client.db('INSY7314-POE');
const userCollection = db.collection('Users');

async function setupEmployees() {
  try {
    console.log('Setting up employee account...');

    // Get employee credentials from environment variables
    const employee = {
      fullName: process.env.EMPLOYEE_FULL_NAME,
      idNumber: process.env.EMPLOYEE_ID_NUMBER,
      accountNumber: process.env.EMPLOYEE_ACCOUNT_NUMBER,
      username: process.env.EMPLOYEE_USERNAME,
      password: process.env.EMPLOYEE_PASSWORD,
      role: process.env.EMPLOYEE_ROLE
    };

    // Validate that all required environment variables are present
    if (!employee.fullName || !employee.idNumber || !employee.accountNumber ||
        !employee.username || !employee.password || !employee.role) {
      throw new Error('Missing required employee environment variables. Please check .env file.');
    }

    // Check if employee already exists
    const existingEmployee = await userCollection.findOne({
      username: employee.username
    });

    if (existingEmployee) {
      console.log(`Employee ${employee.username} already exists, skipping...`);
      return;
    }

    // Hash password, idNumber and account number
    const hashedPassword = await bcrypt.hash(employee.password, salt);
    const hashedAccountNumber = await bcrypt.hash(employee.accountNumber, salt);
    const hashedIdNumber = await bcrypt.hash(employee.idNumber, salt);

    const newEmployee = {
      fullName: employee.fullName,
      idNumber: hashedIdNumber,
      accountNumber: hashedAccountNumber,
      username: employee.username,
      role: employee.role,
      password: hashedPassword,
      createdAt: new Date()
    };

    // Insert employee into collection
    const result = await userCollection.insertOne(newEmployee);
    console.log(`Employee ${employee.username} created successfully with ID: ${result.insertedId}`);
    console.log(`   Credentials: Username: ${employee.username}, Password: ${employee.password}`);

    console.log('Employee setup completed successfully!');
    console.log('\nEMPLOYEE LOGIN CREDENTIALS:');
    console.log('================================');
    console.log(`Username: ${employee.username}`);
    console.log(`Account Number: ${employee.accountNumber}`);
    console.log(`Password: ${employee.password}`);

  } catch (error) {
    console.error('Error setting up employee:', error.message);
    throw error;
  }
}

module.exports = { setupEmployees };
