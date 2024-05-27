const { response } = require("express");
const { ImgHeroeMongo } = require("../models");
const { isValidObjectId } = require("../helpers/mongo-verify");
const { now } = require("mongoose");


const obtenerImgHeroe = async (req, res = response) => {
    const { id } = req.params;

    try {
        const imgHeroe = await ImgHeroeMongo.findById(id)

        res.json({ Ok: true, resp: imgHeroe });
    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

const obtenerImgXIdHeroe = async (req, res = response) => {
    const { id } = req.params;
    //const { limite = 5, desde = 0 } = req.query;
    const query = { heroes_id: id};
    //const query = {};
    try {

        const [total, imgHeroes ] = await Promise.all([
            ImgHeroeMongo.countDocuments(query),
            ImgHeroeMongo.find(query)
            .populate("imagenes_id", "url"),
          //.skip(Number(desde))
          //.limit(Number(limite)),
        ]);

        res.json({ Ok: true, total: total, resp: imgHeroes });
    } catch (error) {
        console.log(error);
        res.json({ Ok: false, resp: error });
    }
};

const crearImgHeroe = async (req, res = response) => {
    const { estado, usuario, ...body } = req.body;

    try {
        const imagenDB = await ImgHeroeMongo.findOne({ heroes_id: body.heroes_id, imagenes_id: body.imagenes_id });

        if (imagenDB) {
            return res.status(400).json({
                msg: `La imagen, ya existe para este Heroe`,
            });
        }

        // Generar la data a guardar
        const data = {
            ...body,
        };

        const imgHeroe = new ImgHeroeMongo(data);

        // Guardar DB
        await imgHeroe.save();

        res.status(201).json({ Ok: true, msg:'Imagen Insertada', resp: imgHeroe });
    } catch (error) {
        console.log("ERROR:INSERTAR",error);
        res.json({ Ok: false, resp: error });
    }
};

const actualizarImgHeroe = async (req, res = response) => {
    const { id } = req.params;
    const data = req.body;

    try {

        //Verifica que la URL existe
        const imagenDB = await ImgHeroeMongo.findOne({ heroes_id: data.heroes_id, imagenes_id: data.imagenes_id });

        if (imagenDB) {
            return res.status(400).json({
                msg: `La imagen, ya existe para este Heroe`,
            });
        }

        const imgHeroe = await ImgHeroeMongo.findByIdAndUpdate(id, data, {
            new: true,
        });

        res.json({ Ok: true, msg:'Imagen Actualizada', resp: imgHeroe });
    } catch (error) {
        console.log("ERROR_MODIFICAR",error);
        res.json({ Ok: false, resp: error });
    }
};

const borrarImgHeroe = async (req, res = response) => {
    const { id } = req.params;

    try {

        const imagenBorrada = await ImgHeroeMongo.findByIdAndDelete(id);

        res.json({ Ok: true, msg:'Imagen Borrada', resp: imagenBorrada });

    } catch (error) {
        console.log("ERROR_BORRADO",error);
        res.json({ Ok: false, resp: error });
    }
};

module.exports = {
    obtenerImgHeroe,
    obtenerImgXIdHeroe,
    crearImgHeroe,
    actualizarImgHeroe,
    borrarImgHeroe,
};
