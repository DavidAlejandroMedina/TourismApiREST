const { response, request } = require("express");
// const { Role, Usuario } = require("../models");
const { UserMongo } = require("../models");
const bcryptjs = require("bcryptjs");
const { now } = require("mongoose");
const { generateJWT } = require("../helpers");


const getUsers = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { state: true };

    const [total, users] = await Promise.all([
        UserMongo.countDocuments(query),
        UserMongo.find(query)
        .populate("rol", "rol")
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        users,
    });
};

const getUser = async (req, res = response) => {
    const { id } = req.params;
    try {
        const user = await UserMongo.findById(id);
        
        res.json({ Ok: true, resp: user });
    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

const postUser = async (req, res = response) => {
    const body = req.body;
    //const { nombre, correo, password, rol } = req.body;

    const user = new UserMongo(body);
    //const user = new UserMongo({ name, mail, password, rol });

    //Verfificar el email
    /*
        const existeEmail = await Usuario.findOne({correo:usuario.correo})
        if (existeEmail){
            return res.status(400).json({
                msg: 'El correo ya esta registrado...'
            })
        }
        */

    try {

        //Encryptar la constraseña
        const salt = bcryptjs.genSaltSync();
        //let unpassword = usuario.password;
        user.password = await bcryptjs.hash(user.password, salt);

        //Guardar en BD
        await user.save();

        // Generar el JWT
        const token = await generateJWT(user.id);

        res.json({
            ok: true,
            msg: "Created ok",
            user,
            token,
        });

    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};


const putUser = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, mail, ...data } = req.body;

    //const { estado, usuario, ...data } = req.body;

    try {

        if (password) {
        //Encryptar la constraseña
        const salt = bcryptjs.genSaltSync();
        //let unpassword = usuario.password;
        resto.password = bcryptjs.hashSync(password, salt);
        }

        /*
        if (data.rol) {
        if (isValidObjectId(data.rol)) {
            const existeRole = await Role.findById(data.rol);

            if (!existeRole) {
            return res
                .status(400)
                .json({
                Ok1: false,
                resp: `El Role ${data.rol}, no existe`,
                });
            }
        }
        else{
            return res
            .status(400)
            .json({
            Ok2: false,
            resp: `El Role ${data.rol}, no es un MongoBDId`,
            });        
        
        }     
        }
        */

        data.date_creation = now();
        const user = await UserMongo.findByIdAndUpdate(id, data, { new: true });

        res.json({
            ok: true,
            msg: "Update ok",
            user
        });

    } catch (error) {
        res.json({ Ok3: false, resp: error });
    }
};


const deleteUser = async (req, res = response) => {
    const { id } = req.params;

    //Borrado Fisico
    //const user = await User.findByIdAndDelete(id);
    try {
        // Borrado Logico
        const user = await UserMongo.findByIdAndUpdate(id, { state: false, date_creation: now() }, { new: true });

        res.json({
            user
        });

        res.json({
            ok: true,
            msg: "Delete ok",
            user
        });

    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

module.exports = {
    getUsers,
    getUser,
    postUser,
    putUser,
    deleteUser,
};

