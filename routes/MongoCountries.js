const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos } = require('../middlewares');

const {
    getCountries,
    getCountry,
    createCountry,
    updateCountry,
    deleteCountry,
} = require('../controllers/MongoCountries');

const { existCountryById } = require('../helpers/db-validators');

const router = Router();


//  Obtener todos los países - publico
router.get('/', getCountries );

// Obtener un país - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existCountryById ),
], getCountry );

// Crear un país - privado - cualquiera con token válido
router.post('/', [ 
    //validarJWT,
    check('name','El nombre del país es obligatorio').not().isEmpty(),
    validarCampos
], createCountry );

// Actualizar un país - privado - cualquiera con token válido
router.put('/:id',[
    //validarJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existCountryById ),
    validarCampos
], updateCountry );

// Borrar un país
router.delete('/:id',[
    //validarJWT,
    //esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existCountryById ),
    validarCampos,
], deleteCountry );

module.exports = router;