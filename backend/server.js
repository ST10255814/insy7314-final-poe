const express = require('express')
const app = express()
const cors = require('cors')
const helmet = require('helmet')
const https = require('https')
const fs = require('fs')
const cookieParser = require('cookie-parser')

const { connectMongo } = require('./database/db')
const userRoutes = require('./auth/user')

const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser()) // Parse cookies from requests
app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://localhost:3000', // Specify frontend origin
    credentials: true // Allow cookies to be sent with requests
}))
app.use(helmet()) //Secure headers

// NB to self: Remember to configure endpoints to prevent cross site scripting and sql injections

//Configure https for SSL traffic encryption
const server = https.createServer({
    key: fs.readFileSync('keys/privatekey.pem'),
    cert: fs.readFileSync('keys/certificate.pem')
}, app)

// Simple test route
app.get('/', (_, res) => {
    res.json({ message: 'API is running!' });
});

app.use(userRoutes) //User endpoints

//Initiate connection to mongoDB
connectMongo()

//Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
