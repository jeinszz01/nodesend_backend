const express = require('express');
const router = express.Router();
const enlacesController = require('../controllers/enlacesController');
const archivosController = require('../controllers/archivosController');
const { check } = require('express-validator')
const auth = require('../middleware/auth')

router.post('/',
    [
        check('nombre', 'Suba un archivo').notEmpty(),
        check('nombre_original', 'Suba un archivo').notEmpty(),
    ],
    auth,
    enlacesController.nuevoEnlace
)

router.get('/',
    enlacesController.allEnlaces
)

router.get('/:url_id',
    enlacesController.consultarPassword,
    enlacesController.obtenerEnlace
)

router.post('/:url_id',
    enlacesController.verificarPassword,
    enlacesController.obtenerEnlace
)

module.exports = router