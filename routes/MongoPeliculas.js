const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { 
    crearPelicula,
    obtenerPeliculas,
    obtenerPelicula,
    actualizarPelicula,
    borrarPelicula
} = require('../controllers/MongoPeliculas');

const { existePeliculaPorId } = require('../helpers/db-validators');

const router = Router();


//  Obtener todas las Pelicula - publico
router.get('/', obtenerPeliculas );

// Obtener una Pelicula por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existePeliculaPorId ),
    validarCampos,
], obtenerPelicula );

// Crear Pelicula - privado - cualquier persona con un token válido
router.post('/', [ 
    //validarJWT,
    check('titulo','El título de la pelicula es obligatorio').not().isEmpty(),
    validarCampos
], crearPelicula );

// Actualizar Pelicula - privado - cualquiera con token válido
router.put('/:id',[
    //validarJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existePeliculaPorId ),
    validarCampos
], actualizarPelicula );

// Borrar un Pelicula
router.delete('/:id',[
    //validarJWT,
    //esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existePeliculaPorId ),
    validarCampos,
], borrarPelicula );

module.exports = router;