//Service to be used
const userService = require('../service/userService')

exports.registerUser = async (req, res) => {
    try{
        console.log(`Registration request received ${JSON.stringify(req.body, null, 2)}`)
        const newUser = await userService.registerUser(req.body)
        res.status(201).json(newUser)
        console.log(`Registration was successful: ${res.statusCode}`)
    }
    catch (error){
        res.status(400).json({ error: error.message })
    }
}

exports.loginUser = async (req, res) => {
    try {
        console.log(`Login Request received ${JSON.stringify(req.body, null, 2)}`);
        const user = await userService.loginUser(req.body)
        
        // Set secure HTTP-only cookie to prevent XSS
        res.cookie('authToken', user.token, {
            httpOnly: true,        // Prevents JavaScript access (XSS protection)
            secure: true,          // Only send over HTTPS
            sameSite: 'strict',    // CSRF protection
            maxAge: 3600000,       // 1 hour (matches JWT expiration)
            path: '/'              // Cookie available for entire domain
        });
        
        // Return user data without the token (since it's in cookie now)
        const { token, ...userWithoutToken } = user;
        res.status(200).json(userWithoutToken);
        console.log(`Login was successful: ${res.statusCode}`);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

exports.logoutUser = async (req, res) => {
    try {
        // Clear the authentication cookie
        res.clearCookie('authToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/'
        });
        
        res.status(200).json({ message: 'Logout successful' });
        console.log(`Logout was successful: ${res.statusCode}`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};