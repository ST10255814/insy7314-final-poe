const rateLimiter = require("express-rate-limit");

//https://medium.com/@ignatovich.dm/creating-a-simple-api-rate-limiter-with-node-a834d03bad7a
const userLimiter = rateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minutes window allocation for testing purposes
  max: 10, // only 10 tries within the 1 minute window
  message: { error: "Too many login attempts. Try again later." },
  standardHeaders: true, //Return rate limiting info in the headers
  legacyHeaders: false //Disable the 'X-RateLimit-*' header
});

module.exports = {
    userLimiter
}