// importando o Model User
const User = require('../models/User')

// exportando UserController
module.exports = class UserController {

    static async register(req, res) {
        res.json({message: 'Olá Get A Pet!'})
    }

}