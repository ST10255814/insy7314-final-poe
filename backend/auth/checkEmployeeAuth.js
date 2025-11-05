const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

const checkEmployeeAuth = (req, res, next) => {
    try {
        // Get token from HTTP-only cookie 
        const token = req.cookies.authToken;
        
        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }
        
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if user has Employee role
        if (decoded.role !== 'Employee') {
            return res.status(403).json({ message: "Access denied. Employee access required." });
        }
        
        req.user = decoded; // Add user info to request object
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Your session is expired. Please login again." });
    }
};

const checkCustomerAuth = (req, res, next) => {
    try {
        // Get token from HTTP-only cookie 
        const token = req.cookies.authToken;
        
        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }
        
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if user has Customer role
        if (decoded.role !== 'Customer' && !decoded.role) { // Support legacy users without role
            return res.status(403).json({ message: "Access denied. Customer access required." });
        }
        
        req.user = decoded; // Add user info to request object
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Your session is expired. Please login again." });
    }
};

module.exports = { checkEmployeeAuth, checkCustomerAuth };