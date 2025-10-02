//Service to be used
const userService = require('../service/userService');
const { sanitizeInput } = require('../utils/validation');

exports.registerUser = async (req, res) => {
    try{
        // Sanitize request body
        const sanitizedBody = {};
        for (const [key, value] of Object.entries(req.body)) {
            sanitizedBody[key] = sanitizeInput(value);
        }
        
        console.log(`Registration request received ${JSON.stringify(sanitizedBody, null, 2)}`);
        const newUser = await userService.registerUser(sanitizedBody);
        res.status(201).json(newUser);
        console.log(`Registration was successful: ${res.statusCode}`);
    }
    catch (error){
        res.status(400).json({ error: error.message });
    }
}

exports.loginUser = async (req, res) => {
    try {
        // Sanitize request body
        const sanitizedBody = {};
        for (const [key, value] of Object.entries(req.body)) {
            sanitizedBody[key] = sanitizeInput(value);
        }
        
        console.log(`Login Request received ${JSON.stringify(sanitizedBody, null, 2)}`);
        const user = await userService.loginUser(sanitizedBody);
        
        //https://youtu.be/4TtAGhr61VI?si=8aM_p6UlWJawdRBf
        // Set secure HTTP-only cookie to prevent XSS
        res.cookie('authToken', user.token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 3600000,
            path: '/'
        });
        
        // Return user data without the token (since it's in cookie now)
        const { token, ...userWithoutToken } = user;
        res.status(200).json({
            message: 'Login successful',
            user: userWithoutToken
        });
        console.log(`Login was successful: ${res.statusCode}`);
    } catch (error) {
        console.error(`Login error: ${error.message}`);
        res.status(401).json({ error: error.message });
    }
};

exports.logoutUser = async (_, res) => {
    try {
        // Clear the authentication cookie
        res.clearCookie('authToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/'
        });
        
        res.status(200).json({ message: 'Logout successful' });
        console.log('User logged out successfully');
    } catch (error) {
        console.error(`Logout error: ${error.message}`);
        res.status(500).json({ error: 'Logout failed' });
    }
};