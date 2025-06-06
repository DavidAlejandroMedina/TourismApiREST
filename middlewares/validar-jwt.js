const jwt = require('jsonwebtoken');
const { request, response } = require("express");

const User = require('../models/MongoUsers')


const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: ' No hay token en la peticion...'
        })
    }

    try {
        //Valida el token
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //console.log(uid);
        const user = await User.findById(uid)

        if(!user){
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe en BD'
            })

        }

        if(!user.state){
            return res.status(401).json({
                msg: 'Token no valido - usuario con estado: false'
            })
        }

        req.user = user;

        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: ' El token no es valido...'
        })

    }


    //console.log(token);

    //next();
}


module.exports = {
    validarJWT,
}