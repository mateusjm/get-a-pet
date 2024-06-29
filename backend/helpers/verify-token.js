const jwt = require('jsonwebtoken')
const getToken = require('./get-token')

// validação do token do usuário
const checkToken = (req, res, next) => {

    // caso usuário não receba o headers
    if(!req.headers.authorization) {
        return res.status(401).json({message: 'Acesso negado!'})
    }

    // obtendo o token
    const token = getToken(req)
    
    // caso usuário não tenha o token
    if(!token) {
        return res.status(401).json({message: 'Acesso negado!'})
    }

    // jwt vai verificar a autenticidade do token, se ele condiz 
    try {
        const verified = jwt.verify(token, 'nossosecret')
        req.user = verified
        next()

    } catch(err) {
        return res.status(400).json({message: 'Token inválido!'})
    }

}

module.exports = checkToken

