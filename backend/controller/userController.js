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
        res.status(200).json(user);
        console.log(`Login was successful: ${res.statusCode}`);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};