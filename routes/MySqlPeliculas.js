const { Router } = require('express');
const { Peliculas } = require('../models/MySqlPeliculas');

const {
    validarJWTMySQL,
} = require('../middlewares');

const {
    peliculaGet,
    peliculaGetId,
    peliculaGetTitulo,
    peliculaPost,
    peliculaPut,
    peliculaDelete,
    peliculaPatch
} = require('../controllers/MySqlPeliculas');

const router = Router();

router.get('/', peliculaGet);
router.get('/:id', peliculaGetId);
router.get('/titulo/:termino', peliculaGetTitulo);
router.post('/', validarJWTMySQL, peliculaPost);
router.put('/:id', validarJWTMySQL, peliculaPut);
router.delete('/:id', validarJWTMySQL, peliculaDelete);
router.patch('/', peliculaPatch);

module.exports = router;