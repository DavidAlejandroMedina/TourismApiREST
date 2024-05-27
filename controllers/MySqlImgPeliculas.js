const { response, request } = require('express');
const { ImgPeliculas } = require('../models/MySqlImgPeliculas');
const { Peliculas } = require('../models/MySqlPeliculas');
const { Imagenes } = require('../models/MySqlImagenes');
const { bdmysql } = require('../database/MySqlConnection');


const imgPeliculaGet = async (req, res = response) => {
    try {
        const imgPeliculaAll = await ImgPeliculas.findAll();

        res.json({
            ok: true,
            data: imgPeliculaAll
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


const imgPeliculaGetId = async (req = request, res = response) => {
    const { id } = req.params;

    try{

        const imgPelicula = await ImgPeliculas.findByPk(id);
        
        if (!imgPelicula) {
            return res.status(404).json({
                ok:false,
                msg: 'No existe una imagen de película con el id: '+ id
            })
        }

        res.json({
            ok: true,
            data: imgPelicula
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

// Obtiene la imagen por titulo de pelicula
const imgPeliculaGetTitulo = async(req = request, res = response) => {

    const { termino } = req.params;

    try {
        const [results, metadata] = await bdmysql.query(
            "SELECT peliculas.titulo, peliculas.fecha_lanzamiento, imagenes.descripcion, imagenes.url" +
            " FROM img_peliculas" +
            " INNER JOIN peliculas ON img_peliculas.peliculas_id = peliculas.id" +
            " INNER JOIN imagenes ON img_peliculas.imagenes_id = imagenes.id" +
            " WHERE peliculas.titulo like '%" + termino + "%'"
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


const imgPeliculaPost = async (req = request, res = response) => {
    // console.log(req.body)

    const { peliculas_id, imagenes_id } = req.body;

    const nuevaImgPelicula = new ImgPeliculas({ peliculas_id, imagenes_id });

    try {

        const existePelicula = await Peliculas.findOne({
            where: {
                id: peliculas_id
            }
        })
        const existeImagen = await Imagenes.findOne({
            where: {
                id: imagenes_id
            }
        })

        if (!existePelicula){
            return res.status(400).json({
                msg: 'No existe una película con id: ' + peliculas_id
            })
        }
        if (!existeImagen){
            return res.status(400).json({
                msg: 'No existe una imagen con id: ' + imagenes_id
            })
        }

        // Validación para confimar que las 2 FK relacionadas no se duplique ese registro
        const existeImgPelicula = await ImgPeliculas.findOne({
            where: {
                peliculas_id: peliculas_id,
                imagenes_id:imagenes_id
            }
        })

        if (existeImgPelicula){
            return res.status(400).json({
                msg: 'Ya existe una imagen para película con esa misma información'
            })
        }

        crearImgPelicula = await nuevaImgPelicula.save();

        //Ajusta el Id del nuevo registro
        nuevaImgPelicula.id = crearImgPelicula.null;

        res.status(201).json({
            ok: true,
            msg: 'Imagen de película Creada',
            data: nuevaImgPelicula
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


const imgPeliculaPut = async (req, res = response) => {

    const { id } = req.params;
    const { body } = req;

    const { peliculas_id, imagenes_id } = req.body;

    try {
        const imgPelicula = await ImgPeliculas.findByPk(id);

        if (!imgPelicula){
            return res.status(404).json({
                ok: false,
                msg: 'No existe una imagen de película con el id: ' + id
            })
        }

        const existePelicula = await Peliculas.findOne({
            where: {
                id: peliculas_id
            }
        })
        const existeImagen = await Imagenes.findOne({
            where: {
                id: imagenes_id
            }
        })

        if (!existePelicula){
            return res.status(400).json({
                msg: 'No existe una película con id: ' + peliculas_id
            })
        }
        if (!existeImagen){
            return res.status(400).json({
                msg: 'No existe una imagen con id: ' + imagenes_id
            })
        }

        // Validación para confimar que las 2 FK relacionadas no se duplique ese registro
        const existeImgPelicula = await ImgPeliculas.findOne({
            where: {
                peliculas_id: peliculas_id,
                imagenes_id:imagenes_id
            }
        })

        if (existeImgPelicula){
            return res.status(400).json({
                msg: 'Ya existe una imagen para película con esa misma información'
            })
        }

        await imgPelicula.update(body);

        res.json({
            ok: true,
            msg: 'Imagen de película Actualizada',
            data: imgPelicula
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


const imgPeliculaDelete = async (req, res = response) => {

    const { id } = req.params;
    //const { _id, password, google, correo, ...resto } = req.body;

    //const uid = req.uid;
    try {
        const imgPelicula = await ImgPeliculas.findByPk(id);

        if (!imgPelicula){
            return res.status(404).json({
                ok: false,
                msg: 'No existe una imagen de película con el id: ' + id
            })
        }

        //Borrado Logico.
        // await pelicula.update({estado:false});

        //Borrado de la BD
        await imgPelicula.destroy();

        res.json({
            ok: true,
            msg: 'Imagen de película Eliminada',
            data: imgPelicula
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


const imgPeliculaPatch = async(req, res = response) => {

    res.json({
        //ok:true,
        msg:'patch API - Controller',
    })
}


module.exports = {
    imgPeliculaGet,
    imgPeliculaGetId,
    imgPeliculaGetTitulo,
    imgPeliculaPost,
    imgPeliculaPut,
    imgPeliculaDelete,
    imgPeliculaPatch
}