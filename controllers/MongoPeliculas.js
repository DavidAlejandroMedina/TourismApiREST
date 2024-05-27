const { response } = require("express");
const { PeliculaMongo, ImgPeliculaMongo, CastingMongo } = require("../models");

const { isValidObjectId } = require("../helpers/mongo-verify");
const { now } = require("mongoose");


const obtenerPeliculas = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    //const query = { estado: true };

    try {
        const [total, peliculas] = await Promise.all([
            PeliculaMongo.countDocuments(),
            PeliculaMongo.find({})
            .skip(Number(desde))
            .sort({nombre:1}) // Ordena por nombre
            //.limit(Number(limite)),
        ]);

        res.json({ Ok: true, total: total, resp: peliculas });
    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

const obtenerPelicula = async (req, res = response) => {
    const { id } = req.params;
    try {
        const pelicula = await PeliculaMongo.findById(id);
        
        res.json({ Ok: true, resp: pelicula });
    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

const crearPelicula = async (req, res = response) => {

    const body = req.body;
    //console.log("BODY INICIO",body);
    
    try {
        const peliculaDB = await PeliculaMongo.findOne({ titulo: body.titulo });

        if (peliculaDB) {
            return res
            //.status(400)
            .json({
                Ok: false,
                msg: `La película ${body.titulo}, ya existe`,
            });
        }

        const pelicula = new PeliculaMongo(body);

        // Guardar en BD
        await pelicula.save();

        res.json({ Ok: true, msg: 'Película Insertada', resp: pelicula });

    } catch (error) {
        console.log("ERROR:INSERTAR",error);
        res.json({ Ok: false, msg:'Error al Insertar Película', resp: error });
    }
};

const actualizarPelicula = async (req, res = response) => {
    const { id } = req.params;
    const data = req.body;

    try {
        if (data.titulo) {
            const peliculaDB = await PeliculaMongo.findOne({ titulo: data.titulo });

            if (peliculaDB) {
            return res.status(400).json({
                msg: `La película ${data.titulo}, ya existe`,
            });
            }
        }

        const pelicula = await PeliculaMongo.findByIdAndUpdate(id, data, { new: true });

        res.json({ Ok: true, msg: 'Película Actualizada',resp: pelicula });
    } catch (error) {
        console.log("ERROR_MODIFICAR",error);
        res.json({ Ok: false, resp: error });
    }
};

const borrarPelicula = async (req, res = response) => {
    const { id } = req.params;

    try {
        const [totalImagenes] = await Promise.all([
            ImgPeliculaMongo.countDocuments({ peliculas_id: id }),
            // ImgPeliculaMongo.find({ peliculas_id: id })
            //.limit(Number(limite)),
        ]);
        const [totalCasting] = await Promise.all([
            CastingMongo.countDocuments({ peliculas_id: id }),
            // CastingMongo.find({ peliculas_id: id })
            //.limit(Number(limite)),
        ]);

        if (totalImagenes > 0){
            return res
            //.status(400)
            .json({
                Ok: false,
                msg: `La película tiene (${totalImagenes}) imagenes asignadas y no puede ser borrado....`,
            });
        }
        else if (totalCasting > 0){
            return res
            //.status(400)
            .json({
                Ok: false,
                msg: `La película tiene (${totalCasting}) casting asignado y no puede ser borrado....`,
            });
        }
        else{
            const peliculaBorrada = await PeliculaMongo.findByIdAndDelete(id);

            res.json({ Ok: true, msg: 'Película Borrada', resp: peliculaBorrada });
        }
    } catch (error) {
        console.log("ERROR_BORRADO",error);
        res.json({ Ok: false, resp: error });
    }
};

module.exports = {
    obtenerPeliculas,
    obtenerPelicula,
    crearPelicula,
    actualizarPelicula,
    borrarPelicula,
};