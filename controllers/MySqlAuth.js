const { response } = require("express");
const { ConnectionRefusedError } = require("sequelize");
const { Usuarios } = require("../models/MySqlUsuarios");
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");


const login = async (req, res = response) => {

    const { correo, password } = req.body;

    var condition = { where: { correo: correo } };

    try {
        // Verificar si el email existe
        const usuario = await Usuarios.findOne(condition);

        if (!usuario) {
            return res.status(400).json({
                ok:false,
                msg: 'Usuario / Password no son correctos - correo: ' + correo
            })
        }

        // Verificar si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                ok:false,
                msg: 'Usuario / Password no son correctos - estado: false'
            })
        }

        const validaPassword = bcryptjs.compareSync( password, usuario.password );

        // Verificar la contraseña
        if (!validaPassword) {
            return res.status(400).json({
                ok:false,
                msg: 'Usuario / Password no son correctos - password'
            })
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);


        res.json({
            ok:true,
            msg: 'Login ok',
            uid: usuario.id,
            bpid:usuario.brandProviderId,
            role:usuario.rol,
            token
        })

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Problema desde el servidor',
            err: error
        })


    }

}

module.exports = {
    login
}