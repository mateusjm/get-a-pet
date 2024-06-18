// importando o Model User
const User = require('../models/User')
const bcrypt = require('bcrypt')

// importando helpers
const createUserToken = require('../helpers/create-user-token')

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
}