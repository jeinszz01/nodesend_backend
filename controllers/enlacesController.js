const Enlaces = require('../models/Enlace');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const hashear = require('../helpers/hashearPassw');
const { validationResult } = require('express-validator');


exports.nuevoEnlace  = async (req, res, next) => {
    // Mostrar mensajes de error de express validator
    const errores = validationResult(req)
    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()});
    }
    console.log(req.body)
    // creamos un enlace. (sin usuario autenticado)
    const { nombre_original, nombre } = req.body
    
    const enlace = new Enlaces()
    enlace.url_id = shortid.generate()
    enlace.nombre = nombre
    enlace.nombre_original = nombre_original
    
    // Si el usuario esta autenticado (logueado)
    if(req.usuario) {
        const { cod_seguridad = null, descargas = 1 } = req.body
        // Si ingresamos un codigo de seguridad o numero de descargas asignamos
        enlace.descargas = descargas
        enlace.cod_seguridad = await hashear(cod_seguridad)
        enlace.autor = req.usuario.id
    }
    // Almacenar en la base de datos
    try {
        await enlace.save()
        return res.json({msg: `${enlace.url_id}`})
        next()
    } catch (error) {
        console.log(error)
        console.log('hubo un error al guardar el enlace')
    }
}

// Obtener todos los enlaces
exports.allEnlaces = async(req, res) => {
    try {
        const enlaces = await Enlaces.find({}).select('url_id -_id')
        res.json({enlaces})
    } catch (error) {
        console.log(error)
    }
}

// Consultamos si tiene un password
exports.consultarPassword = async(req, res, next) => {
    // Verificar si existe el enlace en la bd
    const { url_id } = req.params
    
    const enlace = await Enlaces.findOne({url_id})
    if(!enlace) {
        res.status(404).json({msg: 'Este enlace no existe'})
        return
    }

    if(enlace.cod_seguridad) {
        return res.json({password: true, enlace: enlace.url_id, archivo: enlace.nombre})
    }
    next()
}

// Obtenemos el enlace
exports.obtenerEnlace = async (req, res, next) => {

    // Verificar si existe el enlace en la bd
    const { url_id } = req.params
    
    const enlace = await Enlaces.findOne({url_id})
    if(!enlace) {
        res.status(404).json({msg: 'Ese enlace no existe'})
        return next()
    }
    // Si existe
    res.json({archivo: enlace.nombre, password: false})

    next()
}

exports.verificarPassword = async (req, res, next) => {
    // Tanto url_id como el codigo se pueden obtener con req
    const { url_id } = req.params
    const { codigo } = req.body
    
    const enlace = await Enlaces.findOne({url_id})

    const passwordCorrect = bcrypt.compareSync(codigo, enlace.cod_seguridad)

    if(passwordCorrect) {
        // res.json({password: false})
        next()
    } else {
        res.status(401).json({msg: 'El código es incorrecto'})
    }
}