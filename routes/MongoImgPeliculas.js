const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const {
    obtenerImgPelicula,
    obtenerImgXIdPelicula,
    crearImgPelicula,
    actualizarImgPelicula,
    borrarImgPelicula
} = require('../controllers/MongoImgPeliculas');

const { existeImgPeliculaPorId, existePeliculaPorId } = require('../helpers/db-validators');
const router = Router();


// Obtener una Imagen por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeImgPeliculaPorId ),
    validarCampos,
], obtenerImgPelicula );

// Obtener todas las Imagen por IdPelicula - publico
router.get('/pelicula/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existePeliculaPorId ),
    validarCampos,
], obtenerImgXIdPelicula );

// Crear Imagen - privado - cualquier persona con un token válido
router.post('/', [ 
    //validarJWT,
    // check('descripcion','La descripción de la imagen es obligatoria').not().isEmpty(),
    validarCampos
], crearImgPelicula );

// Actualizar Imagen - privado - cualquiera con token válido
router.put('/:id',[
    //validarJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeImgPeliculaPorId ),
    validarCampos
], actualizarImgPelicula );

// Borrar un Imagen
router.delete('/:id',[
    //validarJWT,
    //esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeImgPeliculaPorId ),
    validarCampos,
], borrarImgPelicula );

module.exports = router;