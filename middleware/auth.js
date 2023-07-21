const jwt = require('jsonwebtoken')
require('dotenv').config({path: 'variables.env'})

module.exports = (req, res, next) => {
    // Obtenemos el jwt del usuario registrado.
    const autHeader = req.get('Authorization')
    
    if(autHeader) {
        // Obtener el token
        const token = autHeader.split(' ')[1]
        // Comprobar el jwt
        try {
            const usuario = jwt.verify(token, process.env.SECRETT)
            // imprimimos contenido del jwt
            req.usuario = usuario
        } catch (error) {
            console.log(error)
            console.log('Token no valido')
        }
    }

    return next()
}