const Usuario = require('../models/Usuario')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config({path: 'variables.env'})
const { validationResult } = require('express-validator')

exports.autenticarUsuario = async (req, res, next) => {

    // Mostrar mensajes de error de express validator cuando se envie campos vacios o similar.
    const errores = validationResult(req)
    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()});
    }

    // Verificar si el usuario existe
    const { correo, password } = req.body
    const usuario = await Usuario.findOne({ correo })
    
    if(!usuario) {
        res.status(401).json({msg: 'El usuario no existe.'})
        return next() // evita ejecutar sgtes lineas
    }

    // Verificar si el password es correcto
    const passwordCorrect = bcrypt.compareSync(password, usuario.password)
    if(passwordCorrect) {
        // Generamos un jwtoken
        const token = jwt.sign({
            nombre: usuario.nombre,
            correo: usuario.correo,
            id: usuario._id
        }, process.env.SECRETT, {
            expiresIn: '8h'
        })
        res.json({token})
    } else {
        res.status(401).json({msg: 'Password incorrecto.'})
    }
}

exports.usuarioAutenticado = (req, res) => {
    
    res.json({usuario: req.usuario})
}