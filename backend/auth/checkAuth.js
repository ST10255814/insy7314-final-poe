const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const checkAuth = (req, res, next) => {
  try {
    // Get token from HTTP-only cookie
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add user info to request object
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Your session is expired. Please login again.' });
  }
};

module.exports = { checkAuth };
