const { Router } = require('express');
const { ImgHeroes } = require('../models/MySqlImgHeroes');

const {
    validarJWTMySQL,
} = require('../middlewares');

const {
    imgHeroeGet,
    imgHeroeGetId,
    imgHeroeGetHeroe,
    imgHeroePost,
    imgHeroePut,
    imgHeroeDelete,
    imgHeroePatch
} = require('../controllers/MySqlImgHeroes');

const router = Router();

router.get('/', imgHeroeGet);
router.get('/:id', imgHeroeGetId);
router.get('/nombreHeroe/:termino', imgHeroeGetHeroe);
router.post('/', validarJWTMySQL, imgHeroePost);
router.put('/:id', validarJWTMySQL, imgHeroePut);
router.delete('/:id', validarJWTMySQL, imgHeroeDelete);
router.patch('/', imgHeroePatch);

module.exports = router;