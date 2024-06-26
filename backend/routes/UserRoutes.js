// importando Router 
const router = require('express').Router()

// importando User Controller
const UserController = require('../controllers/UserController')

// midlleware
const verifyToken = require('../helpers/verify-token')
const {imageUpload} = require('../helpers/image-upload')

// adicionando rotas a UserController pelas funções
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/checkuser', UserController.checkUser)
router.get('/:id', UserController.getUserById)
router.patch('/edit/:id', verifyToken, imageUpload.single('image') ,UserController.editUser)

// exportando Router
module.exports = router