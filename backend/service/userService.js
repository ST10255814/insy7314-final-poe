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
        // Validate and sanitize all inputs
        const accountNumber = validateAndSanitize('Account Number', data.accountNumber, VALIDATION_PATTERNS.ACCOUNTNUMBER);
        const password = validateAndSanitize('Password', data.password, VALIDATION_PATTERNS.PASSWORD);
        const username = validateAndSanitize('Username', data.username, VALIDATION_PATTERNS.USERNAME);

        if (!accountNumber || !password || !username) {
            throw new Error('All fields are required');
        }

        // Find user by Username
        const existingUser = await userCollection.findOne({ 
            accountNumber: accountNumber,
            username: username 
        });

        if (!existingUser) {
            throw new Error('Invalid credentials');
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(password, existingUser.password);

        if (!passwordMatch) {
            throw new Error('Invalid credentials');
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: existingUser._id, username: existingUser.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Return safe response
        return {
            id: existingUser._id,
            username: existingUser.username,
            fullName: existingUser.fullName,
            accountNumber: existingUser.accountNumber,
            token
        };

    } catch (error) {
        console.error(`Login error: ${error.message}`);
        throw error;
    }
}

async function registerUser(data) {
    try {
        // Validate and sanitize all inputs
        const fullName = validateAndSanitize('Full Name', data.fullName, VALIDATION_PATTERNS.FULLNAME);
        const idNumber = validateAndSanitize('ID Number', data.idNumber, VALIDATION_PATTERNS.IDNUMBER);
        const accountNumber = validateAndSanitize('Account Number', data.accountNumber, VALIDATION_PATTERNS.ACCOUNTNUMBER);
        const username = validateAndSanitize('Username', data.username, VALIDATION_PATTERNS.USERNAME);
        const password = validateAndSanitize('Password', data.password, VALIDATION_PATTERNS.PASSWORD);

        if (!fullName || !idNumber || !accountNumber || !password || !username) {
            throw new Error('All fields are required');
        }

        // Check if user already exists
        const existingUser = await userCollection.findOne({
            $or: [
                { accountNumber: accountNumber },
                { username: username },
                { idNumber: idNumber }
            ]
        });

        if (existingUser) {
            throw new Error('User already exists with this account number, username, or ID number');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            fullName,
            idNumber,
            accountNumber,
            username,
            password: hashedPassword,
            createdAt: new Date()
        };

        // Insert into collection
        const result = await userCollection.insertOne(newUser);
        console.log(`User registered successfully: ${result.insertedId}`);

        return {
            id: result.insertedId,
            fullName,
            username,
            accountNumber,
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