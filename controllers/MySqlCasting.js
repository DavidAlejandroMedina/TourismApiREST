const { response, request } = require('express');
const { CastingPelicula } = require('../models/MySqlCasting');
const { Peliculas } = require('../models/MySqlPeliculas');
const { Heroes } = require('../models/MySqlHeroes');
const { bdmysql } = require('../database/MySqlConnection');


const castingGet = async (req, res = response) => {
    try {
        const castingAll = await CastingPelicula.findAll();

        res.json({
            ok: true,
            data: castingAll
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


const castingGetId = async (req = request, res = response) => {
    const { id } = req.params;

    try{

        const casting = await CastingPelicula.findByPk(id);
        
        if (!casting) {
            return res.status(404).json({
                ok:false,
                msg: 'No existe un casting con el id: '+ id
            })
        }

        res.json({
            ok: true,
            data: casting
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


const castingGetPersonaje = async(req = request, res = response) => {

    const { termino } = req.params;

    try {
        const [results, metadata] = await bdmysql.query(
            "SELECT personaje, peliculas_id, heroes_id" +
            " FROM casting_pelicula" +
            " WHERE personaje like '%" + termino + "%'" +
            " ORDER BY personaje"
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


const castingPost = async (req = request, res = response) => {
    // console.log(req.body)

    const { id, personaje, peliculas_id, heroes_id } = req.body;

    const nuevoCasting = new CastingPelicula({ id, personaje, peliculas_id, heroes_id });

    try {
        const existePelicula = await Peliculas.findOne({
            where: {
                id: peliculas_id
            }
        })

        const existeHeroe = await Heroes.findOne({
            where: {
                id: heroes_id
            }
        })

        if (!existePelicula){
            return res.status(400).json({
                msg: 'No existe una pelicula con id: ' + peliculas_id
            })
        }

        if (!existeHeroe){
            return res.status(400).json({
                msg: 'No existe un heroe con id: ' + heroes_id
            })
        }

        // const existeCasting = await CastingPelicula.findOne({
        //     where: {
        //         id: id
        //     }
        // })

        // if (existeCasting){
        //     return res.status(400).json({
        //         msg: 'Ya existe un casting con id: ' + id
        //     })
        // }

        crearCasting = await nuevoCasting.save();

        //Ajusta el Id del nuevo registro
        nuevoCasting.id = crearCasting.null;

        res.status(201).json({
            ok: true,
            msg: 'Casting Creado',
            data: crearCasting
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


const castingPut = async (req, res = response) => {

    const { id } = req.params;
    const { body } = req;

    try {
        const casting = await CastingPelicula.findByPk(id);

        if (!casting){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un casting con el id: ' + id
            })
        }

        await casting.update(body);

        res.json({
            ok: true,
            msg: 'Casting Actualizado',
            data: casting
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


const castingDelete = async (req, res = response) => {

    const { id } = req.params;
    //const { _id, password, google, correo, ...resto } = req.body;

    //const uid = req.uid;
    try {
        const casting = await CastingPelicula.findByPk(id);

        if (!casting){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un casting con el id: ' + id
            })
        }

        //Borrado Logico.
        // await pelicula.update({estado:false});

        //Borrado de la BD
        await casting.destroy();

        res.json({
            ok: true,
            msg: 'Casting Eliminado',
            data: casting
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


const castingPatch = async(req, res = response) => {

    res.json({
        //ok:true,
        msg:'patch API - Controller',
    })
}


module.exports = {
    castingGet,
    castingGetId,
    castingGetPersonaje,
    castingPost,
    castingPut,
    castingDelete,
    castingPatch
}