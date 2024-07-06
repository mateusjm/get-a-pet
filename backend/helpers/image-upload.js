// importando pacotes
const multer = require('multer')
const path = require('path')

// destino para imagens
const imageStorage = multer.diskStorage({
    destination: function(req, file, cb) {

        // definindo a pasta 
        let folder = ""

        // definindo qual pasta a image vai pela url caso seja pets ou users
        if(req.baseUrl.includes('users')) {
            folder = 'users'
        } else if (req.baseUrl.includes('pets')) {
            folder = 'pets'
        }

        // definindo path dinâmico através do cb
        cb(null, `public/images/${folder}`)
        
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + String(Math.floor(Math.random() * 100)) + path.extname(file.originalname))
    }
})

const imageUpload = multer({
    storage: imageStorage,
    // filtrando arquivo que não seja png ou jpg
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error('Por favor, envie apenas png ou jpg!'))
        }
        cb(undefined, true)
    }
})

module.exports = {imageUpload}
