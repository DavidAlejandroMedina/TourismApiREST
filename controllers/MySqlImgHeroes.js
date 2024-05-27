const { response, request } = require('express');
const { ImgHeroes } = require('../models/MySqlImgHeroes');
const { Heroes } = require('../models/MySqlHeroes');
const { Imagenes } = require('../models/MySqlImagenes');
const { bdmysql } = require('../database/MySqlConnection');


const imgHeroeGet = async (req, res = response) => {
    try {
        const imgHeroeAll = await ImgHeroes.findAll();

        res.json({
            ok: true,
            data: imgHeroeAll
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


const imgHeroeGetId = async (req = request, res = response) => {
    const { id } = req.params;

    try{

        const imgHeroe = await ImgHeroes.findByPk(id);
        
        if (!imgHeroe) {
            return res.status(404).json({
                ok:false,
                msg: 'No existe una imagen de heroe con el id: '+ id
            })
        }

        res.json({
            ok: true,
            data: imgHeroe
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

// Obtiene la imagen por nombre del heroe
const imgHeroeGetHeroe = async(req = request, res = response) => {

    const { termino } = req.params;

    try {
        const [results, metadata] = await bdmysql.query(
            "SELECT heroes.nombre, heroes.aparicion, imagenes.descripcion, imagenes.url" +
            " FROM img_heroes" +
            " INNER JOIN heroes ON img_heroes.heroes_id = heroes.id" +
            " INNER JOIN imagenes ON img_heroes.imagenes_id = imagenes.id" +
            " WHERE heroes.nombre like '%" + termino + "%'"
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


const imgHeroePost = async (req = request, res = response) => {
    // console.log(req.body)

    const { heroes_id, imagenes_id } = req.body;

    const nuevaImgHeroe = new ImgHeroes({ heroes_id, imagenes_id });

    try {

        const existeHeroe = await Heroes.findOne({
            where: {
                id: heroes_id
            }
        })
        const existeImagen = await Imagenes.findOne({
            where: {
                id: imagenes_id
            }
        })

        if (!existeHeroe){
            return res.status(400).json({
                msg: 'No existe un heroe con id: ' + heroes_id
            })
        }
        if (!existeImagen){
            return res.status(400).json({
                msg: 'No existe una imagen con id: ' + imagenes_id
            })
        }

        // Validación para confimar que las 2 FK relacionadas no se duplique ese registro
        const existeImgHeroe = await ImgHeroes.findOne({
            where: {
                heroes_id: heroes_id,
                imagenes_id:imagenes_id
            }
        })

        if (existeImgHeroe){
            return res.status(400).json({
                msg: 'Ya existe una imagen para heroe con esa misma información'
            })
        }

        crearImgHeroe = await nuevaImgHeroe.save();

        //Ajusta el Id del nuevo registro
        nuevaImgHeroe.id = crearImgHeroe.null;

        res.status(201).json({
            ok: true,
            msg: 'Imagen de heroe Creada',
            data: nuevaImgHeroe
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


const imgHeroePut = async (req, res = response) => {

    const { id } = req.params;
    const { body } = req;

    const { heroes_id, imagenes_id } = req.body;

    try {
        const imgHeroe = await ImgHeroes.findByPk(id);

        if (!imgHeroe){
            return res.status(404).json({
                ok: false,
                msg: 'No existe una imagen de heroe con el id: ' + id
            })
        }

        const existeHeroe = await Heroes.findOne({
            where: {
                id: heroes_id
            }
        })
        const existeImagen = await Imagenes.findOne({
            where: {
                id: imagenes_id
            }
        })

        if (!existeHeroe){
            return res.status(400).json({
                msg: 'No existe un heroe con id: ' + heroes_id
            })
        }
        if (!existeImagen){
            return res.status(400).json({
                msg: 'No existe una imagen con id: ' + imagenes_id
            })
        }

        // Validación para confimar que las 2 FK relacionadas no se duplique ese registro
        const existeImgHeroe = await ImgHeroes.findOne({
            where: {
                heroes_id: heroes_id,
                imagenes_id:imagenes_id
            }
        })

        if (existeImgHeroe){
            return res.status(400).json({
                msg: 'Ya existe una imagen para heroe con esa misma información'
            })
        }

        await imgHeroe.update(body);

        res.json({
            ok: true,
            msg: 'Imagen de heroe Actualizada',
            data: imgHeroe
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


const imgHeroeDelete = async (req, res = response) => {

    const { id } = req.params;
    //const { _id, password, google, correo, ...resto } = req.body;

    //const uid = req.uid;
    try {
        const imgHeroe = await ImgHeroes.findByPk(id);

        if (!imgHeroe){
            return res.status(404).json({
                ok: false,
                msg: 'No existe una imagen de heroe con el id: ' + id
            })
        }

        //Borrado Logico.
        // await pelicula.update({estado:false});

        //Borrado de la BD
        await imgHeroe.destroy();

        res.json({
            ok: true,
            msg: 'Imagen de heroe Eliminada',
            data: imgHeroe
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


const imgHeroePatch = async(req, res = response) => {

    res.json({
        //ok:true,
        msg:'patch API - Controller',
    })
}


module.exports = {
    imgHeroeGet,
    imgHeroeGetId,
    imgHeroeGetHeroe,
    imgHeroePost,
    imgHeroePut,
    imgHeroeDelete,
    imgHeroePatch
}