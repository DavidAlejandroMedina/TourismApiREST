const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const {
    getCities,
    getCity,
    createCity,
    deleteCity,
} = require('../controllers/MongoCities');

const { existCityById } = require('../helpers/db-validators');

const router = Router();


// Obtener todas las ciudades - publico
router.get('/', getCities );

// Obtener una Ciudad - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existCityById ),
    validarCampos,
], getCity );

// Crear una ciudad - privado - cualquiera con token válido
router.post('/', [ 
    // validarJWT,
    check('name','El nombre de la ciudad es obligatorio').not().isEmpty(),
    validarCampos
], createCity );

// Borrar una ciudad
router.delete('/:id',[
    //validarJWT,
    //esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existCityById ),
    validarCampos,
], deleteCity );

module.exports = router;