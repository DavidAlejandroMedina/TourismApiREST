const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const {
    getMenuPlaces,
    getMenuPlace,
    getMenuPlaceByPlace,
    getMenuPlaceByDish,
    createMenuPlace,
} = require('../controllers/MongoMenuPlaces');

const { existMenuPlaceById, existDishById, existPlaceById } = require('../helpers/db-validators');

const router = Router();


//  Obtener todos los Sitios de Menu - publico
router.get('/', getMenuPlaces );

// Obtener un Sitio de Menu - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existMenuPlaceById ),
    validarCampos,
], getMenuPlace );

// Obtener todos los Sitios de Menu por lugar - publico
router.get('/place/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existPlaceById ),
    validarCampos,
], getMenuPlaceByPlace );   

// Obtener todos los Sitios de Menu por plato - publico
router.get('/dish/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existDishById ),
    validarCampos,
], getMenuPlaceByDish );

// Crear un Sitio de Menu - privado
router.post('/', [ 
    validarJWT,
    check('place_id', 'No es un id de Mongo válido').isMongoId(),
    check('place_id').custom( existPlaceById ),
    check('dish_id', 'No es un id de Mongo válido').isMongoId(),
    check('dish_id').custom( existDishById ),
    validarCampos
], createMenuPlace );

module.exports = router;