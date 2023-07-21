const Usuarios = require('../models/Usuario');
const hashear = require('../helpers/hashearPassw');
const { validationResult } = require('express-validator')

exports.crearUsuario = async(req, res) => {

    // Mostrar mensajes de error de express validator
    const errores = validationResult(req)
    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()});
    }

    // Verificar si el usuario ya estubo registrado
    const { correo, password } = req.body;

    let usuario = await Usuarios.findOne({correo})
    if(usuario) {
        return res.status(400).json({msg: 'Usuario ya registrado.'})
    }

    // Crear nuevo usuario
    usuario = new Usuarios(req.body)
    // Hashear el password
    usuario.password = await hashear(password)
    
    try {
        await usuario.save()
        res.json({msg: 'Usuario creado correctamente, Inicie Sesión'})
    } catch (error) {
        console.log('no se pudo crear el usuario')
    }
}