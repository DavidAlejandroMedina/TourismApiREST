const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { 
    crearImagen,
    obtenerImagenes,
    obtenerImagen,
    actualizarImagen,
    borrarImagen
} = require('../controllers/MongoImagenes');

const { existeImagenPorId } = require('../helpers/db-validators');

const router = Router();


//  Obtener todas las Imagenes - publico
router.get('/', obtenerImagenes );

// Obtener una Imagen por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeImagenPorId ),
    validarCampos,
], obtenerImagen );

// Crear Imagen - privado - cualquier persona con un token válido
router.post('/', [ 
    //validarJWT,
    check('descripcion','La descripción de la imagen es obligatoria').not().isEmpty(),
    validarCampos
], crearImagen );

// Actualizar Imagen - privado - cualquiera con token válido
router.put('/:id',[
    //validarJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeImagenPorId ),
    validarCampos
], actualizarImagen );

// Borrar un Imagen
router.delete('/:id',[
    //validarJWT,
    //esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeImagenPorId ),
    validarCampos,
], borrarImagen );

module.exports = router;