const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const {
    obtenerImgHeroe,
    obtenerImgXIdHeroe,
    crearImgHeroe,
    actualizarImgHeroe,
    borrarImgHeroe
} = require('../controllers/MongoImgHeroes');

const { existeImgHeroePorId, existeHeroePorId } = require('../helpers/db-validators');
const router = Router();


// Obtener una Imagen por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeImgHeroePorId ),
    validarCampos,
], obtenerImgHeroe );

// Obtener todas las Imagen por IdHeroe - publico
router.get('/heroe/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeHeroePorId ),
    validarCampos,
], obtenerImgXIdHeroe );

// Crear Imagen - privado - cualquier persona con un token válido
router.post('/', [ 
    //validarJWT,
    // check('descripcion','La descripción de la imagen es obligatoria').not().isEmpty(),
    validarCampos
], crearImgHeroe );

// Actualizar Imagen - privado - cualquiera con token válido
router.put('/:id',[
    //validarJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeImgHeroePorId ),
    validarCampos
], actualizarImgHeroe );

// Borrar un Imagen
router.delete('/:id',[
    //validarJWT,
    //esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeImgHeroePorId ),
    validarCampos,
], borrarImgHeroe );

module.exports = router;