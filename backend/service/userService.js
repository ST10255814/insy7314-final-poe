const { client } = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

//Declare salt variable and collection/client to be used
const salt = 10
const db = client.db('INSY7314-POE')
const userCollection = db.collection('Users')

//Regex Pattern
//https://www.w3schools.com/js/js_regexp.asp 
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{10,128}$/ 
const IDNUMBER_REGEX = /^\d{13}$/
const ACCOUNTNUMBER_REGEX = /^[0-9]+$/
const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/

async function loginUser(data) {
    const { accountNumber, password, username } = data;

    if ( !accountNumber || !password|| !username) {
        throw new Error("All fields are required");
    }
    if(!PASSWORD_REGEX.test(password)){
        throw new Error("Invalid password format. Please include a number, uppercase and a special character and ensure its 10 characters in length")
    }

    if(!ACCOUNTNUMBER_REGEX.test(accountNumber)){
        throw new Error("Invalid account number")
    }

    if(!USERNAME_REGEX.test(username)){
        throw new Error("Invalid username. Username must start with a letter and be a minimum of 3 characters")
    }

    try {
        // Find user by Username
        const user = await userCollection.findOne({username });
        if (!user) {
            throw new Error("Invalid username, account number or password");
        }

        // Compare password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new Error("Invalid username, account number or password");
        }

        // Compare account number
        const isAccountNumberMatch = await bcrypt.compare(accountNumber, user.accountNumber);
        if (!isAccountNumberMatch) {
            throw new Error("Invalid username, account number or password");
        }

        // Generate JWT token
        const token = jwt.sign(
        { username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
        );

        // Return safe response
        return {
            message: "Login successful",
            userId: user._id,
            username: user.username,
            token: token
        };
    } catch (error) {
        throw new Error(`Error logging in: ${error.message}`);
    }
}

async function registerUser(data) {
    const { fullName, idNumber, accountNumber, username,  password } = data;

    if (!fullName || !idNumber || !accountNumber || !password) {
        throw new Error("All fields are required");
    }

    if(!PASSWORD_REGEX.test(password)){
        throw new Error("Invalid password format. Please include a number, uppercase and a special character and ensure its 10 characters in length")
    }

    if(!IDNUMBER_REGEX.test(idNumber)){
        throw new Error("Invalid id format. Must be 13 characters long and contain only digits")
    }
    if(!ACCOUNTNUMBER_REGEX.test(accountNumber)){
        throw new Error("Invalid account number")
    }
    if(!USERNAME_REGEX.test(username)){
        throw new Error("Invalid username. Username must start with a letter and be a minimum of 3 characters")
    }

    try {
        // Check if user already exists
        const existingUser = await userCollection.findOne({ idNumber }); //Find user by idNumber
        if (existingUser) {
            throw new Error("User already exists");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, salt);
        const hashedId = await bcrypt.hash(idNumber, salt)
        const hashedAccountNumber = await bcrypt.hash(accountNumber, salt)

        const newUser = {
            fullName: fullName,
            idNumber: hashedId,
            accountNumber: hashedAccountNumber,
            username: username,
            role: "Customer",
            password: hashedPassword,
            createdAt: new Date()
        };

        // Insert into collection
        const result = await userCollection.insertOne(newUser);
        if (!result.acknowledged) {
            throw new Error("Failed to insert user");
        }

        const userId = result.insertedId; //Get the user ID

        return {
            _id: userId,
            username: newUser.username,
            createdAt: newUser.createdAt,
            message: "User registered Successfully"
        };

    } catch (error) {
        throw new Error(`Error registering user: ${error.message}`);
    }
}

module.exports = {
    loginUser,
    registerUser
};