const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController')
const { check } = require('express-validator')

router.post('/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('correo', 'El correo no es válido').isEmail(),
        check('password', 'El password debe tener almenos 6 caracteres').isLength({min: 6}),
    ],
    usuarioController.crearUsuario
)

module.exports = router