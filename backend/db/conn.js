// importando o Mongoose
const mongoose = require('mongoose')

// definindo função main e criando banco GetAPet
async function main() {
    await mongoose.connect('mongodb://localhost:27017/getapet')
    console.log('Conectou ao Mongoose!')
}

// ativando função e verificando possível erro
main().catch((err)=> console.log(err))

// exportando mongoose
module.exports = mongoose