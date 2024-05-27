const { response, request } = require('express');
const { Imagenes } = require('../models/MySqlImagenes');
const { bdmysql } = require('../database/MySqlConnection');


const imagenGet = async (req, res = response) => {
    try {
        const imagenesAll = await Imagenes.findAll();

        res.json({
            ok: true,
            data: imagenesAll
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


const imagenGetId = async (req = request, res = response) => {
    const { id } = req.params;

    try{

        const imagen = await Imagenes.findByPk(id);
        
        if (!imagen) {
            return res.status(404).json({
                ok:false,
                msg: 'No existe una imágen con el id: '+ id
            })
        }

        res.json({
            ok: true,
            data: imagen
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


const imagenGetDescripcion = async(req = request, res = response) => {

    const { termino } = req.params;

    try {
        const [results, metadata] = await bdmysql.query(
            "SELECT descripcion, url" +
            " FROM imagenes" +
            " WHERE descripcion like '%" + termino + "%'" +
            " ORDER BY id"
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


const imagenPost = async (req = request, res = response) => {
    // console.log(req.body)

    const { descripcion, url } = req.body;

    const nuevaImagen = new Imagenes({ descripcion, url });

    try {
        const existeImagen = await Imagenes.findOne({
            where: {
                url: url
            }
        })

        if (existeImagen){
            return res.status(400).json({
                msg: 'Ya existe una imagen con la misma url'
            })
        }

        crearImagen = await nuevaImagen.save();

        //Ajusta el Id del nuevo registro
        nuevaImagen.id = crearImagen.null;

        res.status(201).json({
            ok: true,
            msg: 'Imagen Creada',
            data: crearImagen
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


const imagenPut = async (req, res = response) => {

    const { id } = req.params;
    const { body } = req;

    try {
        const imagen = await Imagenes.findByPk(id);

        if (!imagen){
            return res.status(404).json({
                ok: false,
                msg: 'No existe una imagen con el id: ' + id
            })
        }

        await imagen.update(body);

        res.json({
            ok: true,
            msg: 'Imagen Actualizada',
            data: imagen
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


const imagenDelete = async (req, res = response) => {

    const { id } = req.params;
    //const { _id, password, google, correo, ...resto } = req.body;

    //const uid = req.uid;
    try {
        const imagen = await Imagenes.findByPk(id);

        if (!imagen){
            return res.status(404).json({
                ok: false,
                msg: 'No existe una imagen con el id: ' + id
            })
        }

        //Borrado Logico.
        // await pelicula.update({estado:false});

        //Borrado de la BD
        await imagen.destroy();

        res.json({
            ok: true,
            msg: 'Imagen Eliminada',
            data: imagen
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


const imagenPatch = async(req, res = response) => {

    res.json({
        //ok:true,
        msg:'patch API - Controller',
    })
}


module.exports = {
    imagenGet,
    imagenGetId,
    imagenGetDescripcion,
    imagenPost,
    imagenPut,
    imagenDelete,
    imagenPatch
}