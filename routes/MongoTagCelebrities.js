const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const {
    getTagCelebrities,
    getTagCelebrity,
    getTagCelebritiesByUser,
    getTopCelebritiesByTags,
    createTagCelebrity,
} = require('../controllers/MongoTagCelebrities');

const { existTagCelebrityById, existUserById, existCelebrityById } = require('../helpers/db-validators');
const router = Router();


// Obtener todos los tags de celebridades - publico
router.get('/', getTagCelebrities );

// Obtener los top de celebridades por etiquetas - publico
router.get('/top', getTopCelebritiesByTags );

// Obtener un tag de celebridad - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existTagCelebrityById ),
    validarCampos,
], getTagCelebrity );

// Obtener todos los tags de celebridades por usuario - publico
router.get('/user/:id',[
    validarJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existUserById ),
    validarCampos,
], getTagCelebritiesByUser );

// Crear un tag de celebridad - privado - cualquiera con token válido
router.post('/', [ 
    validarJWT,
    check('user_id', 'No es un id de Mongo válido').isMongoId(),
    check('user_id').custom( existUserById ),
    check('celebrity_id', 'No es un id de Mongo válido').isMongoId(),
    check('celebrity_id').custom( existCelebrityById ),
    validarCampos
], createTagCelebrity );

module.exports = router;