const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { 
    getPlaces,
    getPlace,
    getPlaceByCountry,
    createPlace,
    updatePlace,
    deletePlace,
} = require('../controllers/MongoPlaces');

const { existCityById, existPlaceById, existCountryById } = require('../helpers/db-validators');

const router = Router();


//  Obtener todos los sitios - publico
router.get('/', getPlaces );

// Obtener un sitio - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existPlaceById ),
    validarCampos,
], getPlace );

// Obtener un sitio por pais - publico
router.get('/country/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existCountryById ),
    validarCampos,
], getPlaceByCountry );

// Crear un sitio - privado - solo admin
router.post('/', [ 
    validarJWT,
    esAdminRole,
    check('name','El nombre del sitio es obligatorio').not().isEmpty(),
    validarCampos
], createPlace );

// Actualizar un sitio - privado - solo admin
router.put('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existPlaceById ),
    check('name','El nombre del sitio es obligatorio').not().isEmpty(),
    validarCampos
], updatePlace );

// Borrar un sitio
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existPlaceById ),
    validarCampos,
], deletePlace );

module.exports = router;