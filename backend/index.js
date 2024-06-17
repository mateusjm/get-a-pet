// importando express
const express = require('express')
const cors = require('cors')
const app = express()

// configurando JSON response
app.use(express.json())

// resolver CORS
app.use(cors({ credentials: true, origin: 'http://localhost:3000'}))

// configurando a pasta public de imagens do Projeto
app.use(express.static('public'))

// routes

// abrir na porta 5000
app.listen(5000)
