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
};

exports.loginUser = async (req, res) => {
  try {
    // Sanitize request body
    const sanitizedBody = {};
    for (const [key, value] of Object.entries(req.body)) {
      sanitizedBody[key] = sanitizeInput(value);
    }

    console.log(`Login Request received ${JSON.stringify(sanitizedBody, null, 2)}`);
    const user = await userService.loginUser(sanitizedBody);

    // Dave Gray. 2022. MERN Stack Authentication with JWT Access, Refresh Tokens, Cookies. [video online]
    // Available at: <https://youtu.be/4TtAGhr61VI?si=8aM_p6UlWJawdRBf> [Accessed 1 OCtober 2025].
    // Set secure HTTP-only cookie to prevent XSS
    res.cookie('authToken', user.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 3600000,
      path: '/'
    });

    // Return user data without sensitive information
    // eslint-disable-next-line no-unused-vars
    const { password, ...userWithoutPassword } = user;
    res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword
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

    // Clear the CSRF token cookie
    res.clearCookie('csrf-token', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      path: '/'
    });

    res.status(200).json({ message: 'Logout successful - all tokens cleared' });
    console.log('User logged out successfully - all tokens cleared');
  } catch (error) {
    console.error(`Logout error: ${error.message}`);
    res.status(500).json({ error: 'Logout failed' });
  }
};
