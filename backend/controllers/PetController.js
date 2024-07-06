const Pet = require('../models/Pet')

// funções helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

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

    static async getAllUserPets(req, res) {

        // obter usuario pelo token
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({'user._id': user.id }).sort('-createdAt')

        res.status(200).json({
            pets
        })

    }

    static async getAllUserAdoptions(req, res) {

        // obter usuario pelo token
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({'adopter._id': user._id }).sort('-createdAt')

        res.status(200).json({
            pets
        })
    }

}