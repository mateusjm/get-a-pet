// importando o Model User
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// importando helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')

// exportando UserController
module.exports = class UserController {

    // registro
    static async register(req, res) {

        // puxando os dados do body pela requisição
        const {name, email, phone, password, confirmpassword} = req.body

        // validações para as requisições
        if(!name) {
            res.status(422).json({message: 'O nome é obrigatório!'})
            return
        }

        if(!email) {
            res.status(422).json({message: 'O e-mail é obrigatório!'})
            return
        }

        if(!phone) {
            res.status(422).json({message: 'O telefone é obrigatório!'})
            return
        }

        if(!password) {
            res.status(422).json({message: 'A senha é obrigatória!'})
            return
        }

        if(!confirmpassword) {
            res.status(422).json({message: 'A confirmação de senha é obrigatória!'})
            return
        }

        // validação de senha e confirmação de senha
        if(password !== confirmpassword) {
            res.status(422).json({message: 'As senhas não conferem!'})
            return
        }

        // checando se usuário já existe, email que veio pelo body
        const userExists = await User.findOne({email: email})

        // se o email que vir da requisição for encontrado no atributo email, enviamos erro
        if(userExists) {
            res.status(422).json({message: 'Por favor, utilize outro e=mail!'})
            return
        }

        // criando senha 
        // gerando 12 caracteres a mais para senha
        const salt = await bcrypt.genSalt(12)

        // criando um hash (senha criptografada)
        const passwordHash = await bcrypt.hash(password, salt)

        // criando usuário
        const user = new User({
            name: name,
            email: email,
            phone: phone,
            password: passwordHash
        })

        try {
            // salvar usuário
            const newUser = await user.save()
            
            // passando o Usuário salvo para função helper Criação de Token de Usuário
            await createUserToken(newUser, req, res)

        } catch(error) {
            res.status(500).json({message: error})
        }

    }

    // login 
    static async login(req, res) {
        // puxando os dados do body pela requisição
        const {email, password} = req.body

        // validações para as requisições
        if(!email) {
            res.status(422).json({message: 'O e-mail é obrigatório'})
        }

        if(!password) {
            res.status(422).json({message: 'A senha é obrigatória!'})
            return
        }

        // verificando se usuário já existe
        const user = await User.findOne({email: email})

        if(!user) {
            res.status(422).json({message: 'Usuário não encontrado!'})
            return
        }

        // checando se a senha confere com a do Banco de Dados
        const checkPassword = await bcrypt.compare(password, user.password)

        // se a senha não conferir
        if(!checkPassword) {
            res.status(422).json({message: 'Senha inválida!'})
            return
        }

        // login certo, recebe o token
        await createUserToken(user, req, res)
    }

    // obtendo o usuário através do token, para verificar se está logado
    static async checkUser(req, res) {
        let currentUser

        if(req.headers.authorization) {
            const token = getToken(req)
            const decoded = jwt.verify(token, 'nossosecret')

            currentUser = await User.findById(decoded.id)
            currentUser.password = undefined
        } else {
            currentUser = null
        }

        res.status(200).send(currentUser)
    }

    // resgatando usuário por id
    static async getUserById(req, res) {
        const id = req.params.id

        const user = await User.findById(id).select('-password')

        if(!user) {
            res.status(422).json({message: 'Usuário não encontrado'})
            return
        }

        res.status(200).json({user})
    }

    // update do usuário
    static async editUser(req, res) {
        res.status(200).json({message: 'Deu certo update!'})
        return
    }

}