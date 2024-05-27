const { response, request } = require('express');
const { Heroes } = require('../models/MySqlHeroes');
const { bdmysql } = require('../database/MySqlConnection');


const heroesGet = async (req, res = response) => {

    /*
    const query = req.query;

    //Desestructuracion de argumentos
    const { q, nombre = 'No name', apikey, page=1, limit=10} = req.query;

    //res.send('Hello World')
    res.json({
        //ok:true,
        msg:'get API - Controller',
        query,
        q,
        nombre,
        apikey,
        page,
        limit
    })
    */
    
    try {
        // APLICADO A BD
        const heroesAll = await Heroes.findAll();

        res.json({
            ok: true,
            data: heroesAll
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Problema desde el servidor',
            err: error
        })
    }

}


const heroeGetId = async (req = request, res = response) => {
    const { id } = req.params;

    try{

        const heroe = await Heroes.findByPk(id);
        
        if (!heroe) {
            return res.status(404).json({
                ok:false,
                msg: 'No existe un heroe con el id: '+ id
            })
        }

        res.json({
            ok: true,
            data: heroe
        });
    
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Problema desde el servidor',
            err: error
        })
    }

}

// Para hacer una consulta en la base de datos de 2 o mas tablas se puede hacer de una manera más sencilla sin utilizar sequelize que lo complica un poco. Se realiza tu propio query

const heroePropioQueryGet = async(req = request, res = response) => {

    const { termino } = req.params;

    try {
        const [results, metadata] = await bdmysql.query(
            "SELECT nombre,bio" +
            " FROM heroes" +
            " WHERE nombre like '%" + termino + "%'" +
            " ORDER BY nombre"
        );

        res.json({ok:true,
            data: results,
        });
    
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Problema desde el servidor',
            err: error
        })
    }
}


const heroePost = async (req = request, res = response) => {
    // console.log(req.body)

    const { id, nombre, bio, img, aparicion, casa} = req.body;

    const nuevoHeroe = new Heroes({ id, nombre, bio, img, aparicion, casa });

    try {
        const existeHeroe = await Heroes.findOne({
            where: {
                nombre: nombre
            }
        })

        if (existeHeroe){
            return res.status(400).json({
                msg: 'Ya existe un Heroe llamado ' + nombre
            })
        }

        crearHeroe = await nuevoHeroe.save();

        //Ajusta el Id del nuevo registro al Heroe
        nuevoHeroe.id = crearHeroe.null;

        res.status(201).json({
            ok: true,
            msg: 'Heroe Creado',
            data: crearHeroe
        });
    
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Problema desde el servidor',
            err: error
        })
    }
}


const heroePut = async (req, res = response) => {

    const { id } = req.params;
    const { body} = req;

    // console.log(id);
    // console.log(body);

    try {
        const heroe = await Heroes.findByPk(id);

        if (!heroe){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un hereo con el id: ' + id
            })
        }

        await heroe.update(body);

        res.json({
            ok: true,
            msg: 'Heroe Actualizado',
            data: heroe
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Problema desde el servidor',
            err: error
        })
    }
}


const heroeDelete = async (req, res = response) => {

    const { id } = req.params;
    //const { _id, password, google, correo, ...resto } = req.body;

    //const uid = req.uid;
    try {
        const heroe = await Heroes.findByPk(id);

        if (!heroe){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un hereo con el id: ' + id
            })
        }

        //Borrado Logico.
        // await heroe.update({estado:false});

        //Borrado de la BD
        await heroe.destroy();

        res.json({
            ok: true,
            msg: 'Heroe Eliminado',
            data: heroe
        });
    
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Problema desde el servidor',
            err: error
        })
    }
}


const heroePatch = async(req, res = response) => {

    res.json({
        //ok:true,
        msg:'patch API - Controller',
    })
}


module.exports = {
    heroesGet,
    heroeGetId,
    heroePropioQueryGet,
    heroePost,
    heroePut,
    heroeDelete,
    heroePatch
}