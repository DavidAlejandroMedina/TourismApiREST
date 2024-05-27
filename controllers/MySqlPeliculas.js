const { response, request } = require('express');
const { Peliculas } = require('../models/MySqlPeliculas');
const { bdmysql } = require('../database/MySqlConnection');


const peliculaGet = async (req, res = response) => {
    try {
        const peliculasAll = await Peliculas.findAll();

        res.json({
            ok: true,
            data: peliculasAll
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


const peliculaGetId = async (req = request, res = response) => {
    const { id } = req.params;

    try{

        const pelicula = await Peliculas.findByPk(id);
        
        if (!pelicula) {
            return res.status(404).json({
                ok:false,
                msg: 'No existe una pelicula con el id: '+ id
            })
        }

        res.json({
            ok: true,
            data: pelicula
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


const peliculaGetTitulo = async(req = request, res = response) => {

    const { termino } = req.params;

    try {
        const [results, metadata] = await bdmysql.query(
            "SELECT titulo, descripcion" +
            " FROM peliculas" +
            " WHERE titulo like '%" + termino + "%'" +
            " ORDER BY titulo"
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


const peliculaPost = async (req = request, res = response) => {
    // console.log(req.body)

    const { id, titulo, descripcion, fecha_lanzamiento, img } = req.body;

    const nuevaPelicula = new Peliculas({ id, titulo, descripcion, fecha_lanzamiento, img });

    try {
        const existePelicula = await Peliculas.findOne({
            where: {
                titulo: titulo
            }
        })

        if (existePelicula){
            return res.status(400).json({
                msg: 'Ya existe una pelicula llamada ' + titulo
            })
        }

        crearPelicula = await nuevaPelicula.save();

        //Ajusta el Id del nuevo registro
        nuevaPelicula.id = crearPelicula.null;

        res.status(201).json({
            ok: true,
            msg: 'Pelicula Creada',
            data: crearPelicula
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


const peliculaPut = async (req, res = response) => {

    const { id } = req.params;
    const { body } = req;

    // console.log(id);
    // console.log(body);

    try {
        const pelicula = await Peliculas.findByPk(id);

        if (!pelicula){
            return res.status(404).json({
                ok: false,
                msg: 'No existe una pelicula con el id: ' + id
            })
        }

        await pelicula.update(body);

        res.json({
            ok: true,
            msg: 'Pelicula Actualizada',
            data: pelicula
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


const peliculaDelete = async (req, res = response) => {

    const { id } = req.params;
    //const { _id, password, google, correo, ...resto } = req.body;

    //const uid = req.uid;
    try {
        const pelicula = await Peliculas.findByPk(id);

        if (!pelicula){
            return res.status(404).json({
                ok: false,
                msg: 'No existe una pelicula con el id: ' + id
            })
        }

        //Borrado Logico.
        // await pelicula.update({estado:false});

        //Borrado de la BD
        await pelicula.destroy();

        res.json({
            ok: true,
            msg: 'Pelicula Eliminada',
            data: pelicula
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


const peliculaPatch = async(req, res = response) => {

    res.json({
        //ok:true,
        msg:'patch API - Controller',
    })
}


module.exports = {
    peliculaGet,
    peliculaGetId,
    peliculaGetTitulo,
    peliculaPost,
    peliculaPut,
    peliculaDelete,
    peliculaPatch
}