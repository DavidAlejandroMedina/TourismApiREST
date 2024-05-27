const { response } = require("express");
const { CastingMongo } = require("../models");
const { isValidObjectId } = require("../helpers/mongo-verify");
const { now } = require("mongoose");
const { Cast } = require("sequelize/lib/utils");


const obtenerCasting = async (req, res = response) => {
    const { id } = req.params;

    try {
        const casting = await CastingMongo.findById(id)
        //.populate("heroes_id", "nombre")
        //.populate("peliculas_id", "titulo");

        res.json({ Ok: true, resp: casting });
    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

const obtenerCastingXIdHeroe = async (req, res = response) => {
    const { id } = req.params;
    //const { limite = 5, desde = 0 } = req.query;
    const query = { heroes_id: id};
    //const query = {};
    try {

        const [total, castingHeroe ] = await Promise.all([
            CastingMongo.countDocuments(query),
            CastingMongo.find(query)
            .populate("peliculas_id", ["titulo","img"]),
          //.skip(Number(desde))
          //.limit(Number(limite)),
        ]);

        res.json({ Ok: true, total: total, resp: castingHeroe });
    } catch (error) {
        console.log(error);
        res.json({ Ok: false, resp: error });
    }
};

const obtenerCastingXIdPelicula = async (req, res = response) => {
    const { id } = req.params;
    //const { limite = 5, desde = 0 } = req.query;
    const query = { peliculas_id: id};
    //const query = {};
    try {

        const [total, castingPelicula ] = await Promise.all([
            CastingMongo.countDocuments(query),
            CastingMongo.find(query)
            .populate("heroes_id", ["nombre","img"]),
          //.skip(Number(desde))
          //.limit(Number(limite)),
        ]);

        res.json({ Ok: true, total: total, resp: castingPelicula });
    } catch (error) {
        console.log(error);
        res.json({ Ok: false, resp: error });
    }
};

const crearCasting = async (req, res = response) => {
    const { estado, usuario, ...body } = req.body;

    try {
        const castingDB = await CastingMongo.findOne({ heroes_id: body.heroes_id, peliculas_id: body.peliculas_id });

        if (castingDB) {
            return res.status(400).json({
                msg: `La película, ya existe para este Heroe`,
            });
        }

        // Generar la data a guardar
        const data = {
            ...body,
        };

        const casting = new CastingMongo(data);

        // Guardar DB
        await casting.save();

        res.status(201).json({ Ok: true, msg:'Casting Insertado', resp: casting });
    } catch (error) {
        console.log("ERROR:INSERTAR",error);
        res.json({ Ok: false, resp: error });
    }
};

const actualizarCasting = async (req, res = response) => {
    const { id } = req.params;
    const data = req.body;

    try {

        //Verifica que la URL existe
        //const multimediaHeroeDB = await Multimedia.findOne({ url: data.url });
        const castingDB = await CastingMongo.findOne({ heroes_id: data.heroes_id, peliculas_id: data.peliculas_id });

        if (castingDB) {
            return res.status(400).json({
                msg: `La película, ya existe para este Heroe`,
            });
        }


        /*
        //Verifica que la Multimedia Exista
        if (data.IdMultimedia) {
            if (isValidObjectId(data.IdMultimedia)) {
                const existeMultimedia = await Multimedia.findById(
                    data.IdMultimedia
                );

                if (!existeMultimedia) {
                    return res.status(400).json({
                        Ok: false,
                        resp: `El Id Multimedia ${data.IdMultimedia}, no existe`,
                    });
                }
            } else {
                return res.status(400).json({
                    Ok: false,
                    resp: `El Id Multimedia ${data.IdMultimedia}, no es un MongoBDId`,
                });
            }
        }

        //Verifica que el Heroe Exista
        if (data.IdHeroe) {
            if (isValidObjectId(data.IdHeroe)) {
                const existeHeroe = await Heroe.findById(
                    data.IdHeroe
                );

                if (!existeHeroe) {
                    return res.status(400).json({
                        Ok: false,
                        resp: `El Id Heroe ${data.IdHeroe}, no existe`,
                    });
                }
            } else {
                return res.status(400).json({
                    Ok: false,
                    resp: `El Id Heroe ${data.IdHeroe}, no es un MongoBDId`,
                });
            }
        }
        */

        //data.usuario = req.usuario._id;
        //data.fecha_actualizacion = now();

        const casting = await CastingMongo.findByIdAndUpdate(id, data, {
            new: true,
        });

        res.json({ Ok: true, msg:'Casting Actualizado', resp: casting });
    } catch (error) {
        console.log("ERROR_MODIFICAR",error);
        res.json({ Ok: false, resp: error });
    }
};

const borrarCasting = async (req, res = response) => {
    const { id } = req.params;

    try {

        const castingBorrado = await CastingMongo.findByIdAndDelete(id);

        /* Borrado Lógico
        const multimediaHeroeBorrado = await MultimediaHeroe.findByIdAndUpdate(
            id,
            { estado: false, fecha_actualizacion: now() },
            { new: true }
        );
        */

        res.json({ Ok: true, msg:'Casting Borrado', resp: castingBorrado });

    } catch (error) {
        console.log("ERROR_BORRADO",error);
        res.json({ Ok: false, resp: error });
    }
};

module.exports = {
    obtenerCasting,
    obtenerCastingXIdHeroe,
    obtenerCastingXIdPelicula,
    crearCasting,
    actualizarCasting,
    borrarCasting
};
