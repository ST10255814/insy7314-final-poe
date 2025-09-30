const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

//https://youtu.be/mbsmsi7l3r4?si=pUG8Z117F1qiyz2J
const checkAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Your session is expired. Please login again." });
    }
};

module.exports = { checkAuth };
