const rateLimiter = require("express-rate-limit");

//https://medium.com/@ignatovich.dm/creating-a-simple-api-rate-limiter-with-node-a834d03bad7a
const userLimiter = rateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes window allocation
  max: 5, // only 5 tries within the 10 minute window
  message: { error: "Too many login attempts. Try again later." }
});

module.exports = {
    userLimiter
}