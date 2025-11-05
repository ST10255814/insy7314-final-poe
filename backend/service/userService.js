const { client } = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const { validateAndSanitize, VALIDATION_PATTERNS } = require('../utils/validation');
dotenv.config();

//Declare salt variable and collection/client to be used
const salt = 10
const db = client.db('INSY7314-POE')
const userCollection = db.collection('Users')

async function loginUser(data) {
    try {
        const { accountNumber, password, username } = data;

        if (!accountNumber || !password || !username) {
            throw new Error('All fields are required');
        }

        // Validate and sanitize into new variables
        const safeAccountNumber = validateAndSanitize('Account Number', accountNumber, VALIDATION_PATTERNS.ACCOUNTNUMBER);
        const safePassword = validateAndSanitize('Password', password, VALIDATION_PATTERNS.PASSWORD);
        const safeUsername = validateAndSanitize('Username', username, VALIDATION_PATTERNS.USERNAME);

        // Find user by sanitized username
        const existingUser = await userCollection.findOne({ username: safeUsername });
        if (!existingUser) throw new Error('Invalid credentials');

        // Compare password
        const passwordMatch = await bcrypt.compare(safePassword, existingUser.password);
        if (!passwordMatch) throw new Error('Invalid credentials');

        // Compare AccountNumber
        const accountNumberMatch = await bcrypt.compare(safeAccountNumber, existingUser.accountNumber)
        if(!accountNumberMatch) throw new Error('Invalid credentials')

        // Generate JWT token with role information
        const token = jwt.sign(
            { 
                id: existingUser._id, 
                username: existingUser.username, 
                role: existingUser.role || 'Customer' 
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Return safe response
        return {
            id: existingUser._id,
            username: existingUser.username,
            fullName: existingUser.fullName,
            role: existingUser.role || 'Customer',
            token
        };

    } catch (error) {
        console.error(`Login error: ${error.message}`);
        throw error;
    }
}

async function registerUser(data) {
    try {
        const { fullName, idNumber, accountNumber, username, password } = data;

        // Check if any required field is missing
        if (!fullName || !idNumber || !accountNumber || !username || !password) {
            throw new Error('All fields are required');
        }

        // Validate and sanitize all inputs
        const safeFullName = validateAndSanitize('Full Name', fullName, VALIDATION_PATTERNS.FULLNAME);
        const safeIdNumber = validateAndSanitize('ID Number', idNumber, VALIDATION_PATTERNS.IDNUMBER);
        const safeAccountNumber = validateAndSanitize('Account Number', accountNumber, VALIDATION_PATTERNS.ACCOUNTNUMBER);
        const safeUsername = validateAndSanitize('Username', username, VALIDATION_PATTERNS.USERNAME);
        const safePassword = validateAndSanitize('Password', password, VALIDATION_PATTERNS.PASSWORD);

        // Check if user already exists
        const existingUser = await userCollection.findOne({
            $or: [
                { accountNumber: safeAccountNumber },
                { username: safeUsername },
                { idNumber: safeIdNumber }
            ]
        });

        if (existingUser) {
            throw new Error('User already exists with this account number, username, or ID number');
        }

        // Hash password, idNumber and account number
        const hashedPassword = await bcrypt.hash(safePassword, salt);
        const hashedAccountNumber = await bcrypt.hash(safeAccountNumber, salt);
        const hashedIdNumber = await bcrypt.hash(safePassword, salt);

        const newUser = {
            fullName: safeFullName,
            idNumber: hashedIdNumber,
            accountNumber: hashedAccountNumber,
            username: safeUsername,
            role: "Customer",
            password: hashedPassword,
            createdAt: new Date()
        };

        // Insert into collection
        const result = await userCollection.insertOne(newUser);
        console.log(`User registered successfully: ${result.insertedId}`);

        return {
            id: result.insertedId,
            fullName: safeFullName,
            username: safeUsername,
            message: 'User registered successfully'
        };

    } catch (error) {
        console.error(`Registration error: ${error.message}`);
        throw error;
    }
}

module.exports = {
    loginUser,
    registerUser
};