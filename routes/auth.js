const express = require('express');
const router = express.Router();
const authUsuarioController = require('../controllers/authUsuarioController');
const { check } = require('express-validator')
const auth = require('../middleware/auth')

router.post('/',
    [
        check('correo', 'Ingrese un email correcto').isEmail(),
        check('password', 'El password es obligatio').notEmpty(),
    ],
    authUsuarioController.autenticarUsuario
)

router.get('/',
    auth,
    authUsuarioController.usuarioAutenticado
)


module.exports = router