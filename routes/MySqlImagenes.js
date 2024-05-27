const { Router } = require('express');
const { Imagenes } = require('../models/MySqlImagenes');

const {
    validarJWTMySQL,
} = require('../middlewares');

const {
    imagenGet,
    imagenGetId,
    imagenGetDescripcion,
    imagenPost,
    imagenPut,
    imagenDelete,
    imagenPatch
} = require('../controllers/MySqlImagenes');

const router = Router();

router.get('/', imagenGet);
router.get('/:id', imagenGetId);
router.get('/descripcion/:termino', imagenGetDescripcion);
router.post('/', validarJWTMySQL, imagenPost);
router.put('/:id', validarJWTMySQL, imagenPut);
router.delete('/:id', validarJWTMySQL, imagenDelete);
router.patch('/', imagenPatch);

module.exports = router;