const { response } = require("express");
const { UserMongo } = require("../models");
const bcryptjs = require("bcryptjs");
const { generateJWT } = require("../helpers");
// const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
    const { mail, password } = req.body;

    try {
        const user = await UserMongo.findOne({ mail });
        // console.log(user);
        if (!user) {
            return res
            .status(400)
            .json({
                ok: false,
                msg: "Usuario / Password no son correctos - correo: " + mail,
            });
        }

        // Verificar si el usuario esta activo
        if (!user.state) {
            return res
            .status(400)
            .json({
                ok: false,
                msg: "Usuario / Password no son correctos - estado: false",
            });
        }

        const validatePassword = bcryptjs.compareSync(password, user.password);
        // Verificar la contraseña

        if (!validatePassword) {
            return res
            .status(400)
            .json({
                ok: false,
                msg: "Usuario / Password no son correctos - password",
            });
        }

        // Generar el JWT
        const token = await generateJWT(user.id);

        res.json({
            ok: true,
            msg: "Login ok",
            user,
            token,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Hable con el Administrador...",
            error: error,
        });
    }
};

module.exports = {
    login,
};
