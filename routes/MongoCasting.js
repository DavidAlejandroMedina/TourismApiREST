const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const {
    crearCasting,
    obtenerCasting,
    actualizarCasting,
    borrarCasting,
    obtenerCastingXIdHeroe,
    obtenerCastingXIdPelicula
} = require('../controllers/MongoCasting');

const { existeCastingPorId, existeHeroePorId, existePeliculaPorId } = require('../helpers/db-validators');

const router = Router();


// Obtener una Casting por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeCastingPorId ),
    validarCampos,
], obtenerCasting );

// Obtener todas las Casting por IdHeroe - publico
router.get('/heroe/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeHeroePorId ),
    validarCampos,
], obtenerCastingXIdHeroe );

// Obtener todas las Casting por IdPelicula - publico
router.get('/pelicula/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existePeliculaPorId ),
    validarCampos,
], obtenerCastingXIdPelicula );

// Crear Casting - privado - cualquier persona con un token válido
router.post('/', [ 
    //validarJWT,
    // check('descripcion','La descripción de la imagen es obligatoria').not().isEmpty(),
    validarCampos
], crearCasting );

// Actualizar Casting - privado - cualquiera con token válido
router.put('/:id',[
    //validarJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeCastingPorId ),
    validarCampos
], actualizarCasting );

// Borrar un Casting
router.delete('/:id',[
    //validarJWT,
    //esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeCastingPorId ),
    validarCampos,
], borrarCasting );

module.exports = router;