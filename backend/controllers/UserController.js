// importando o Model User
const User = require('../models/User')

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
    }
}