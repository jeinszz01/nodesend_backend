const express = require('express');
const conectarDB = require('./config/db')
const cors = require('cors')

// Creamos nuestro servidor
const app = express();

//Conectar a la base de datos
conectarDB()

// Habilitando Cors polity
const optionsCors = {
    origin: process.env.FRONTEND_URL
}
app.use( cors(optionsCors) )

// Puerto del servidor
const port = process.env.PORT || 4000;

// Habilitar lectura del body
app.use(express.json())

// Habilitar carpeta publica para acceder a: 'http://localhost:4000/${nombre archivo}
app.use(express.static('uploads'))

// Definiendo rutas de la app
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/enlaces', require('./routes/enlaces'))
app.use('/api/archivos', require('./routes/archivos'))



// Arrancamos el servidor
app.listen(port, '0.0.0.0' ,() => {
    console.log('first servidor listening on port', port)
});