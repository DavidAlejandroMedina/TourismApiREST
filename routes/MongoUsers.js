const { Router } = require('express');
const { check} = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')

const { existEmail, existUserById } = require('../helpers/db-validators');

const {
    getUsers,
    getUser,
    postUser,
    putUser,
    deleteUser,
} = require('../controllers/MongoUsers');
const e = require('express');

const router = Router();

router.get('/:id',[
    validarJWT, //Midlleware para el Tokens
    check('id','No es un Id Valido...').isMongoId(),
    check('id').custom(existUserById),
    validarCampos
], getUser);

router.put('/:id',[
    validarJWT, //Midlleware para el Tokens
    check('id','No es un Id Valido...').isMongoId(),
    check('id').custom(existUserById),
    //check('rol').custom(esRoleValido),
    validarCampos
], putUser );

router.post('/',[
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('password','La contraseña debe de ser mas de 6 letras').isLength({min:6}),
    check('mail','El correo no es valido').isEmail(),
    check('rol','No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    /*
    check('rol').custom( async (rol = '') => {
        const existeRol = await Role.findOne({ rol});
        if (!existeRol){   
            throw new Error(`El rol ${ rol} no existe en la Base de Datos...`);
        }
    }),
    */
    // check('rol').custom(esRoleValido),
    check('mail').custom(existEmail),
    validarCampos
], postUser );

router.delete('/:id',[
    validarJWT, //Midlleware para el Tokens    
    check('id','No es un Id Valido...').isMongoId(),
    check('id').custom(existUserById),
    validarCampos
], deleteUser );

module.exports = router;