// importando Router 
const router = require('express').Router()

// importando User Controller
const UserController = require('../controllers/UserController')

// adicionando rotas a UserController pelas funções
router.post('/register', UserController.register)

// exportando Router
module.exports = router