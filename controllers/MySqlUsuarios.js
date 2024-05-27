//const Remote = require('../models/remote');
const { response, request } = require('express');
//const { Plantilla } = require('../models/plantilla');
//const { bdmysql } = require('../db/connection');
const { Usuarios } = require('../models/MySqlUsuarios');
const bcryptjs = require('bcryptjs');
const { body } = require('express-validator');


const usuariosGet = async (req = request, res = response) => {

    const { q, nombre = 'No name', apikey, page = 1, limit } = req.query;

    const unosUsuarios = await Usuarios.findAll();

    res.json({
        data:unosUsuarios
    });
}


const usuariosGetId = async (req = request, res = response) => {

    const { id } = req.params;
   //const { _id, password, google, correo, ...resto } = req.body;

    try {
        const usuario = await Usuarios.findByPk(id);

        if (!usuario) {
            return res.status(404).json({
                ok:false,
                msg: 'No existe un usuario con el id: ' + id
            })
        }

        res.json({
            ok:true,
            data:usuario
        });
    

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Hable con el Administrador',
            err: error
        })

    }
}


const usuariosPost = async (req, res = response) => {

    const { nombre, correo, password, rol, estado, brandProviderId } = req.body;

    const usuario = new Usuarios({ nombre, correo, password, rol, estado, brandProviderId });

    try {

        const existeCorreo = await Usuarios.findOne({ where: { correo: correo } });

        if (existeCorreo) {
            return res.status(400).json({
                ok:false,
                msg: 'Ya existe un usuario con el correo: ' + correo
            })
        }

        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password, salt);

        // Guardar en BD
        await usuario.save();

        res.json({ok:true,
            data:usuario
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Hable con el Administrador',
            err: error
        })

    }

}


const usuariosPut = async (req, res = response) => {

    const { id } = req.params;
    const { body} = req;
   //const { _id, password, google, correo, ...resto } = req.body;

    // console.log(id);
    // console.log(body);

    //var condition = { where :{id: id} };

    try {
        const usuario = await Usuarios.findByPk(id);

        if (!usuario) {
            return res.status(404).json({
                ok:false,
                msg: 'No existe un usuario con el id: ' + id
            })
        }


        if ( body.password ) {
            // Encriptar la contraseña
            const salt = bcryptjs.genSaltSync();
            body.password = bcryptjs.hashSync( body.password, salt );
        }

        console.log(body)
        
        await usuario.update(body);

        res.json({
            ok:true,
            data:usuario
        });
    

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok:false,
            msg: 'Hable con el Administrador',
            err: error
        })
    }
}


const usuariosDelete = async (req, res = response) => {
    const { id } = req.params;
   //const { _id, password, google, correo, ...resto } = req.body;

    //const uid = req.uid;

    console.log(id);
    var condition = { where :{id: id} };

    try {

        const usuario = await Usuarios.findByPk(id);
        //const usuarioAutenticado = req.usuario;

        if (!usuario) {
            return res.status(404).json({
                ok:false,
                msg: 'No existe un usuario con el id: ' + id
            })
        }

        //Borrado Logico.
        await usuario.update({estado:false});

        //Borrado de la BD
        //await usuario.destroy();

        res.json({
            ok:true,
            usuario:usuario, 
            //autenticado:usuarioAutenticado
        });
    

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok:false,
            msg: 'Hable con el Administrador',
            err: error
        })
    }
}


const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}


module.exports = {
    usuariosGet,
    usuariosGetId,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch,
}