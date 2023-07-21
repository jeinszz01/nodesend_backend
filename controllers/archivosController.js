// Subida de archivos con Multer
const multer = require('multer')
const shortid = require('shortid')
const fs = require('fs')    // libreria de node FileSystem(eliminar o crear archivos)
const Enlaces = require('../models/Enlace');


exports.subirArchivo = async (req, res, next) => {

    const configMulter = {
        limits: { fileSize: req.usuario ? 10000000 : 1024 * 1024 }, // 1mega
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, './uploads')
            },
            filename: (req, file, cb) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length)
                cb(null, `${shortid.generate()}${extension}`)
            }
        })
    }
    const upload = multer(configMulter).single('archivo')

    upload(req, res, async(error) => {
        console.log(req.file)
        if(!error) {
            res.json({archivo: req.file})
        } else {
            console.log(error)
            next()
        }
    })

}

exports.eliminarArchivo = async (req, res) => {
    //console.log(req.file)
    try {
        fs.unlinkSync(`./uploads/${req.file}`)
        console.log('archivo eliminado')
    } catch (error) {
        console.log(error)
    }
}

// Descargar un archivo
exports.descargar = async (req, res, next) => {
    // para obtener el enlace lo buscamos en la bd.
    const { archivo } = req.params
    const enlace = await Enlaces.findOne({nombre: archivo})
    console.log(enlace)
    const { descargas, nombre } = enlace
    
    const archivoDownload = `./uploads/${archivo}`
    res.download(archivoDownload)
    
    console.log(descargas, nombre)
    
    if(!enlace) {
        res.redirect("back")
        return next()
    }

    // Si la descarga es igual a 1 - Borrar la entrada o enlace
    if(descargas === 1) {
        // Eliminar el archivo
        // creamos req.file como una variable interna
        req.file = nombre
        // Eliminar la entrada (enlace)
        await Enlaces.findOneAndRemove({nombre: nombre})
        next()
        // Sgt middleware
    } else {
        // Si la descarga es mayor a 1 - Restar 1
        enlace.descargas--
        await enlace.save()
        console.log('aun hay descargas')
    }
}