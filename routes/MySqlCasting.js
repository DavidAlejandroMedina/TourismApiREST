const { Router } = require('express');
const { CastingPelicula } = require('../models/MySqlCasting');

const {
    validarJWTMySQL,
} = require('../middlewares');

const {
    castingGet,
    castingGetId,
    castingGetPersonaje,
    castingPost,
    castingPut,
    castingDelete,
    castingPatch
} = require('../controllers/MySqlCasting');

const router = Router();

router.get('/', validarJWTMySQL, castingGet);
router.get('/:id', validarJWTMySQL,  castingGetId);
router.get('/personaje/:termino', validarJWTMySQL, castingGetPersonaje);
router.post('/', validarJWTMySQL, castingPost);
router.put('/:id', validarJWTMySQL, castingPut);
router.delete('/:id', validarJWTMySQL, castingDelete);
router.patch('/', castingPatch);

module.exports = router;