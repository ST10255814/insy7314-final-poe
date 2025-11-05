const { client } = require('../database/db');
const bcrypt = require('bcrypt');
const dotenv = require("dotenv");
dotenv.config();

const salt = 10;
const db = client.db('INSY7314-POE');
const userCollection = db.collection('Users');

async function setupEmployees() {
    try {
        console.log('Setting up employee accounts...');

        // Default employee credentials
        const employees = [
            {
                fullName: "Bank Employee 1",
                idNumber: "8901234567890", // Sample ID
                accountNumber: "987456321",
                username: "bank_employee_1",
                password: "Employee@123",
                role: "Employee"
            },
            {
                fullName: "Bank Employee 2", 
                idNumber: "8901234567891", // Sample ID
                accountNumber: "987654321",
                username: "bank_employee_2", 
                password: "Employee@124",
                role: "Employee"
            }
        ];

        for (const employee of employees) {
            // Check if employee already exists
            const existingEmployee = await userCollection.findOne({ 
                username: employee.username 
            });

            if (existingEmployee) {
                console.log(`Employee ${employee.username} already exists, skipping...`);
                continue;
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
            console.log(`✅ Employee ${employee.username} created successfully with ID: ${result.insertedId}`);
            console.log(`   Credentials: Username: ${employee.username}, Password: ${employee.password}`);
        }

        console.log('Employee setup completed successfully!');
        console.log('\n🔐 EMPLOYEE LOGIN CREDENTIALS:');
        console.log('================================');
        employees.forEach((emp, index) => {
            console.log(`Employee ${index + 1}:`);
            console.log(`  Username: ${emp.username}`);
            console.log(`  Account Number: ${emp.accountNumber}`);
            console.log(`  Password: ${emp.password}`);
            console.log('');
        });

    } catch (error) {
        console.error('Error setting up employees:', error.message);
        throw error;
    }
}

module.exports = { setupEmployees };