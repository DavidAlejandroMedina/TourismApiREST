const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const {
    getVisitPlaces,
    getVisitPlaceByUser,
    getTopVisitPlacesByCountry,
    getTopUsersByVisits,
    createVisitPlace,
} = require('../controllers/MongoVisitPlaces');

const { existVisitPlaceById, existUserById, existCountryById, existPlaceById } = require('../helpers/db-validators');
const router = Router();


// Obtener todos los sitios visitados - publico
router.get('/', getVisitPlaces );

// Obtener un sitio visitado - publico
router.get('/user/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existUserById ),
    validarCampos,
], getVisitPlaceByUser );

// Obtener los 10 sitios visitados por pais - publico
router.get('/country/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existCountryById ),
    validarCampos,
], getTopVisitPlacesByCountry );

// Obtener los 5 usuarios que más han visitado sitios - publico
router.get('/top', getTopUsersByVisits );

// Crear un sitio visitado - privado - cualquiera con token válido
router.post('/', [ 
    //validarJWT,
    check('user_id', 'No es un id de Mongo válido').isMongoId(),
    check('user_id').custom( existUserById ),
    check('place_id', 'No es un id de Mongo válido').isMongoId(),
    check('place_id').custom( existPlaceById ),
    validarCampos
], createVisitPlace );

module.exports = router;