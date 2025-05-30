const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const {
    getCelebrities,
    getCelebrity,
    getCelebrityByProfession,
    createCelebrity,
    updateCelebrity,
    deleteCelebrity,
} = require('../controllers/MongoCelebrities');

const { existCelebrityById } = require('../helpers/db-validators');

const router = Router();


//  Obtener todas las celebridades - publico
router.get('/', getCelebrities );

// Obtener una celebridad por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existCelebrityById ),
    validarCampos,
], getCelebrity );

// Obtener una celebridad por profesion - publico
router.get('/profession/:profession',[
    // check('profession', 'No es una profesion valida').isIn(['actor', 'director', 'producer']),
    validarCampos,
], getCelebrityByProfession );

// Crear una celebridad - privado - cualquiera con token válido
router.post('/', [ 
    //validarJWT,
    check('name','El nombre de la celebridad es obligatorio').not().isEmpty(),
    validarCampos
], createCelebrity );

// Actualizar una celebridad - privado - cualquiera con token válido
router.put('/:id',[
    //validarJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existCelebrityById ),
    validarCampos
], updateCelebrity );

// Borrar una celebridad
router.delete('/:id',[
    //validarJWT,
    //esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existCelebrityById ),
    validarCampos,
], deleteCelebrity );

module.exports = router;