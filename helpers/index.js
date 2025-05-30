

const dbValidators = require('./db-validators');
const generateJWT   = require('./generate-jwt');
// const googleVerify = require('./google-verify');
const subirArchivo = require('./subir-archivo');
const mongoVerify = require('./mongo-verify');


module.exports = {
    ...dbValidators,
    ...generateJWT,
    // ...googleVerify,
    ...subirArchivo,
    ...mongoVerify,
}