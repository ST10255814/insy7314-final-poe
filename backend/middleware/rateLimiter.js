const rateLimiter = require("express-rate-limit");

// Frontend Highlights. 2024. Creating a Simple API Rate Limiter with NodeJs, Medium. [online] 16 October 2024. 
// Available at: <https://medium.com/@ignatovich.dm/creating-a-simple-api-rate-limiter-with-node-a834d03bad7a> [Accessed 22 September 2025].
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