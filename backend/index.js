// importando express
const express = require('express')
const cors = require('cors')

// definindo app
const app = express()

// importando routes
const UserRoutes = require('./routes/UserRoutes')
const PetRoutes = require('./routes/PetsRoutes')

// configurando JSON response
app.use(express.json())

// resolver CORS
app.use(cors({ credentials: true, origin: 'http://localhost:3000'}))

// configurando a pasta public de imagens do Projeto
app.use(express.static('public'))

// routes
app.use('/users', UserRoutes)
app.use('/pets', PetRoutes)

// abrir na porta 5000
app.listen(5000)
