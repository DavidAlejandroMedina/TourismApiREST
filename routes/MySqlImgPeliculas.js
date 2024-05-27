const { Router } = require('express');
const { ImgPeliculas } = require('../models/MySqlImgPeliculas');

const {
    validarJWTMySQL,
} = require('../middlewares');

const {
    imgPeliculaGet,
    imgPeliculaGetId,
    imgPeliculaGetTitulo,
    imgPeliculaPost,
    imgPeliculaPut,
    imgPeliculaDelete,
    imgPeliculaPatch
} = require('../controllers/MySqlImgPeliculas');

const router = Router();

router.get('/', imgPeliculaGet);
router.get('/:id', imgPeliculaGetId);
router.get('/titulo/:termino', imgPeliculaGetTitulo);
router.post('/', validarJWTMySQL, imgPeliculaPost);
router.put('/:id', validarJWTMySQL, imgPeliculaPut);
router.delete('/:id', validarJWTMySQL, imgPeliculaDelete);
router.patch('/', imgPeliculaPatch);

module.exports = router;