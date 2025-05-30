const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const {
    getDishes,
    getDish,
    getDishesByCountry,
    createDish,
} = require('../controllers/MongoDishes');

const { existDishById, existCountryById } = require('../helpers/db-validators');

const router = Router();


//  Obtener todos los platos - publico
router.get('/', getDishes );

// Obtener un plato - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existDishById ),
    validarCampos,
], getDish );

// Obtener todos los platos por pais - publico
router.get('/country/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existCountryById ),
    validarCampos,
], getDishesByCountry );

// Crear un plato - privado - solo admin
router.post('/', [ 
    validarJWT,
    esAdminRole,
    check('name','El nombre del plato es obligatorio').not().isEmpty(),
    validarCampos
], createDish );

module.exports = router;