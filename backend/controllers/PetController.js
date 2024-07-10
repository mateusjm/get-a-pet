const Pet = require('../models/Pet')

// funções helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const { default: mongoose } = require('mongoose')

// chcecando se um valor é válido pelo ObjectId
const ObjectId = require('mongoose').Types.ObjectId

module.exports = class PetController {

    // criando um Pet
    static async create(req, res) {
        const {name, age, weight, color} = req.body

        const images = req.files

        const available = true

        // images upload

        // validações
        if(!name) {
            res.status(422).json({message: 'O nome é obrigatório!'})
            return
        }

        if(!age) {
            res.status(422).json({message: 'A idade é obrigatória!'})
            return
        }

        if(!weight) {
            res.status(422).json({message: 'O peso é obrigatório!'})
            return
        }

        if(!color) {
            res.status(422).json({message: 'A cor é obrigatória!'})
            return
        }

        if(images.length === 0) {
            res.status(422).json({message: 'A imagem é obrigatória!'})
            return
        }

        // obtendo o dono do Pet (User)
        const token = getToken(req)
        const user = await getUserByToken(token)

        // criando um Pet
        const pet = new Pet({
            name, 
            age,
            weight,
            color,
            available,
            images: [],
            user: {
                _id: user.id,
                name: user.name,
                image: user.image,
                phone: user.phone
            }
        })

        images.map((image)=> {
            pet.images.push(image.filename)
        })

        // salvando o Pet no banco de dados
        try {
            const newPet = await pet.save()
            res.status(201).json({
                message: 'Pet cadastrado com sucesso', 
                newPet
            })
            
        } catch (error) {
            res.status(500).json({message: error})
        }

    }

    // resgatar todos os Pets
    static async getAll(req, res) {

        // ordenando a partir da data de criação do Pet no banco de dados
        const pets = await Pet.find().sort('-createdAt')

        res.status(200).json({
            pets: pets,
        })

    }

    // obter todos usuários que possuem Pets
    static async getAllUserPets(req, res) {

        // obter usuario pelo token
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({'user._id': user.id }).sort('-createdAt')

        res.status(200).json({
            pets
        })

    }

    // obter todos usuários que possuem Adoações
    static async getAllUserAdoptions(req, res) {

        // obter usuario pelo token
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({'adopter._id': user._id }).sort('-createdAt')

        res.status(200).json({
            pets
        })
    }

    // obter Pet pelo ID
    static async getPetById(req, res) {
        const id = req.params.id

        // caso não seja um id válido
        if(!ObjectId.isValid(id)) {
            res.status(422).json({message: 'ID inválido!'})
            return
        }

        // encontrar um Pet no campo id pelo id da requisição
        const pet = await Pet.findOne({_id: id})

        // caso não exista pet 
        if(!pet) {
            res.status(404).json({message: 'Pet não encontrado'})
            return
        }

        // caso exista o pet
        res.status(200).json({
            pet: pet
        })

    }

    // remover Pet pelo Id
    static async removePetById(req, res) {
        const id = req.params.id

        // caso não seja um id válido
        if(!ObjectId.isValid(id)) {
            res.status(422).json({message: 'ID inválido!'})
            return
        }

        // encontrar um Pet no campo id pelo id da requisição
        const pet = await Pet.findOne({_id: id})

        // caso não exista pet 
        if(!pet) {
            res.status(404).json({message: 'Pet não encontrado'})
            return
        }

        // checando se o usuário logado registrou o pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        // se o usuário que está logado for diferente do usuário do pet que será removido
        if(pet.user._id.toString() !== user._id.toString()){
            res.status(422).json({
                message: 'Houve um problema em processar sua solicitação, tente novamente mais tarde!'
            })
            return
        }

        await Pet.findByIdAndDelete(id)

        res.status(200).json({
            message: 'Pet removido com sucesso!'
        })

    }

    // atualizar Pet
    static async updatePet(req, res) {

        const id = req.params.id
        const {name, age, weight, color, available} = req.body
        const images = req.files

        // dados que serão atualizados
        const updatedData = {}

        // checando se pet existe
        const pet = await Pet.findOne({_id: id})

        // caso não exista pet 
        if(!pet) {
            res.status(404).json({message: 'Pet não encontrado'})
            return
        }

        // checando se o usuário logado registrou o pet
        const token = getToken(req)
        const user = await getUserByToken(token)
 
        // caso usuário logado seja diferente do usuário que criou o pet que será removido
        if(pet.user._id.toString() !== user._id.toString()){
             res.status(422).json({
                 message: 'Houve um problema em processar sua solicitação, tente novamente mais tarde!'
             })
             return
        }

        // validações
        if(!name) {
            res.status(422).json({message: 'O nome é obrigatório!'})
            return
        } else {
            updatedData.name = name
        }

        if(!age) {
            res.status(422).json({message: 'A idade é obrigatória!'})
            return
        } else {
            updatedData.age = age
        }

        if(!weight) {
            res.status(422).json({message: 'O peso é obrigatório!'})
            return
        } else {
            updatedData.weight = weight
        }

        if(!color) {
            res.status(422).json({message: 'A cor é obrigatória!'})
            return
        } else {
            updatedData.color = color
        }

        if(images.length === 0) {
            res.status(422).json({message: 'A imagem é obrigatória!'})
            return
        } else {
            updatedData.images = []
            images.map((image) => {
                updatedData.images.push(image.filename)
            })
        }

        await Pet.findByIdAndUpdate(id, updatedData)

        res.status(200).json({
            message: 'Pet atualizado com sucesso!'
        })

    }

    static async schedule(req, res) {
        const id = req.params.id

        // checando se o pet existe
        const pet = await Pet.findOne({_id: id})

        // caso não exista pet 
        if(!pet) {
            res.status(404).json({message: 'Pet não encontrado'})
            return
        }

        // resgatando usuário logado
        const token = getToken(req)
        const user = await getUserByToken(token)
 
        // caso usuário logado queira adotar seu próprio pet
        if(pet.user._id.toString() === user._id.toString()){
            res.status(422).json({
                 message: 'Você não pode agendar uma visita com seu próprio pet'
            })
            return
        }

        // checando se usuário já agendou uma visita
        if(pet.adopter) {
            if(pet.adopter._id.equals(user._id)) {
                res.status(422).json({
                    message: 'Você já agendou uma visita para este pet'
                })
                return
            }
        }

        // adicionar usuário como adotante do pet
        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image
        }

        await Pet.findByIdAndUpdate(id, pet)
        res.status(200).json({
            message: `A visita foi agendada com sucesso, entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}`
        })

    }

    static async concludeAdoption(req, res) {
        const id = req.params.id

        // encontrando pet pelo id da requisição
        const pet = await Pet.findOne({_id: id})

        // caso não exista pet com o id
        if(!pet) {
            res.status(404).json({
                message: 'Pet não encontrado!'
            })
        }

        // resgatando usuário logado
        const token = getToken(req)
        const user = await getUserByToken(token)
 
        // caso id do usuário logado seja diferente do usuário que possui o pet para adoção
        if(pet.user._id.toString() !== user._id.toString()){
            res.status(422).json({
                 message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde!'
            })
            return
        }

        // não está mais disponível esse pet
        pet.available = false

        // atualizando o pet
        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({
            message: 'Parabéns! O ciclo de adoção foi finalizado com sucesso!'
        })


    }

}