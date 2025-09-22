const { client } = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

//Declare salt variable and collection/client to be used
const salt = 10
const db = client.db('INSY7314-POE')
const userCollection = db.collection('Users')

//Regex Patterns
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{10,128}$/;

async function loginUser(data) {
    const { email, password } = data;

    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    try {
        // Find user by email
        const user = await userCollection.findOne({ email });
        if (!user) {
            throw new Error("Invalid email or password");
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid email or password");
        }

        // Generate JWT token
        const token = jwt.sign(
        { email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
        );

        // Return safe response
        return {
            message: "Login successful",
            userId: user._id,
            email: user.email,
            token: token
        };
    } catch (error) {
        throw new Error(`Error logging in: ${error.message}`);
    }
}

async function registerUser(data) {
    const { email, password } = data;

    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    //Check regex patterns against inputs
    if(!EMAIL_REGEX.test(email)){
        throw new Error("Invalid email format")
    }

    if(!PASSWORD_REGEX.test(password)){
        throw new Error("Invalid password format. Please include a number, uppercase and a special character and ensure its 10 characters in length")
    }

    try {
        // Check if user already exists
        const existingUser = await userCollection.findOne({ email });
        if (existingUser) {
            throw new Error("User already exists");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            email,
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
            email: newUser.email,
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