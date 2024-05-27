const { Router } = require('express');

//const { validarJWT } = require('../middlewares/validar-jwt');
//const { esAdminRole } = require('../middlewares/validar-roles');


const {
    validarCampos,
    validarJWTMySQL,
    esAdminRole,
    tieneRole
} = require('../middlewares');


const { 
    usuariosGet,
    usuariosGetId,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch,
} = require('../controllers/MySqlUsuarios');

const router = Router();


router.get('/', 
validarJWTMySQL, //Middleware para el Tokens
esAdminRole, //Middleware para validar el Role
usuariosGet);

router.get('/:id', 
validarJWTMySQL, //Middleware para el Tokens
esAdminRole, //Middleware para validar el Role
usuariosGetId);

router.post('/', 
// validarJWTMySQL, //Middleware para el Tokens
// esAdminRole, //Middleware para validar el Role
usuariosPost);

router.put('/:id', 
validarJWTMySQL, //Middleware para el Tokens
esAdminRole, //Middleware para validar el Role
usuariosPut);

router.delete('/:id',
validarJWTMySQL, //Middleware para el Tokens
esAdminRole, //Middleware para validar el Role
usuariosDelete);

router.patch('/', usuariosPatch);


module.exports = router;