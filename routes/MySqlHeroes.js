const { Router } = require('express');
const { Heroes } = require('../models/MySqlHeroes');

//const { validarJWT } = require('../middlewares/validar-jwt');
//const { esAdminRole } = require('../middlewares/validar-roles');


const {
    validarCampos,
    validarJWTMySQL,
    esAdminRole,
    tieneRole
} = require('../middlewares');


const {
    heroesGet,
    heroeGetId,
    heroePropioQueryGet,
    heroePost,
    heroePut,
    heroeDelete,
    heroePatch
} = require('../controllers/MySqlHeroes');

const router = Router();

/*router.get('/', 
    (req, res) => {
        res.json({
            msg: 'Get API'
        })
    }
)*/

// Implementando métodos HTTP
router.get('/', 
// validarJWTMySQL, //Midlleware para el Tokens
//esAdminRole, //Midlewara para validar el Role
heroesGet);

router.get('/:id', 
// validarJWTMySQL,
//esAdminRole,
heroeGetId);

router.get('/busquedaNombre/:termino', 
// validarJWTMySQL,
//esAdminRole,
heroePropioQueryGet);

router.post('/', 
validarJWTMySQL,
//esAdminRole,
heroePost);

router.put('/:id', 
validarJWTMySQL,
//esAdminRole,
heroePut);

router.delete('/:id',
validarJWTMySQL,
//esAdminRole, 
heroeDelete);

router.patch('/',
//validarJWT,
//esAdminRole, 
heroePatch);

module.exports = router;