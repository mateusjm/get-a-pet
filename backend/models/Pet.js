// importando Mongoose com a conexão já feita
const mongoose = require('../db/conn')
const {Schema} = mongoose

// definindo Model User
const Pet = mongoose.model(
    'Pet',
    new Schema({
        name: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true
        },
        weight: {
            type: Number,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        // inserindo múltiplas fotos pelo campo Array
        images: {
            type: Array,
            required: true
        },
        // true or false para Disponibilidade
        available: {
            type: Boolean
        },
        // inserindo informações de User e Adopter
        user: Object,
        adopter: Object
    },
    {timestamps: true}
)
)

// exportando Model User
module.exports = Pet