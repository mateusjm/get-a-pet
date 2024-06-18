// importando dependências
const jwt = require('jsonwebtoken')

// defindo função helper para Criação de Token do Usuário
const createUserToken = async(user, req, res) => {

    // criando token
    const token = jwt.sign({
        // acessando atributos name e id do novo usuário
        name: user.name,
        id: user._id
        // secret para deixar o token único
    }, 'nossosecret')

    // retornando token, com o token decodificado e o userId
    res.status(200).json({
        message: 'Você está autenticado',
        token: token,
        userId: user._id
    })

}

module.exports = createUserToken