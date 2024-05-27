const { response } = require("express");
const { ImgPeliculaMongo } = require("../models");
const { isValidObjectId } = require("../helpers/mongo-verify");
const { now } = require("mongoose");


const obtenerImgPelicula = async (req, res = response) => {
    const { id } = req.params;

    try {
        const imgPelicula = await ImgPeliculaMongo.findById(id)

        res.json({ Ok: true, resp: imgPelicula });
    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

const obtenerImgXIdPelicula = async (req, res = response) => {
    const { id } = req.params;
    //const { limite = 5, desde = 0 } = req.query;
    const query = { peliculas_id: id};

    try {

        const [total, imgPelicula ] = await Promise.all([
            ImgPeliculaMongo.countDocuments(query),
            ImgPeliculaMongo.find(query)
            .populate("imagenes_id", "url"),
          //.skip(Number(desde))
          //.limit(Number(limite)),
        ]);

        res.json({ Ok: true, total: total, resp: imgPelicula });
    } catch (error) {
        console.log(error);
        res.json({ Ok: false, resp: error });
    }
};

const crearImgPelicula = async (req, res = response) => {
    const { estado, usuario, ...body } = req.body;

    try {
        const imagenDB = await ImgPeliculaMongo.findOne({ peliculas_id: body.peliculas_id, imagenes_id: body.imagenes_id });

        if (imagenDB) {
            return res.status(400).json({
                msg: `La imagen, ya existe para este Heroe`,
            });
        }

        // Generar la data a guardar
        const data = {
            ...body,
        };

        const imgPelicula = new ImgPeliculaMongo(data);

        // Guardar DB
        await imgPelicula.save();

        res.status(201).json({ Ok: true, msg:'Imagen Insertada', resp: imgPelicula });
    } catch (error) {
        console.log("ERROR:INSERTAR",error);
        res.json({ Ok: false, resp: error });
    }
};

const actualizarImgPelicula = async (req, res = response) => {
    const { id } = req.params;
    const data = req.body;

    try {

        //Verifica que la URL existe
        const imagenDB = await ImgPeliculaMongo.findOne({ peliculas_id: data.peliculas_id, imagenes_id: data.imagenes_id });

        if (imagenDB) {
            return res.status(400).json({
                msg: `La imagen, ya existe para esta Pelicula`,
            });
        }

        const imgPelicula = await ImgPeliculaMongo.findByIdAndUpdate(id, data, {
            new: true,
        });

        res.json({ Ok: true, msg:'Imagen Actualizada', resp: imgPelicula });
    } catch (error) {
        console.log("ERROR_MODIFICAR",error);
        res.json({ Ok: false, resp: error });
    }
};

const borrarImgPelicula = async (req, res = response) => {
    const { id } = req.params;

    try {

        const imagenBorrada = await ImgPeliculaMongo.findByIdAndDelete(id);

        res.json({ Ok: true, msg:'Imagen Borrada', resp: imagenBorrada });

    } catch (error) {
        console.log("ERROR_BORRADO",error);
        res.json({ Ok: false, resp: error });
    }
};

module.exports = {
    obtenerImgPelicula,
    obtenerImgXIdPelicula,
    crearImgPelicula,
    actualizarImgPelicula,
    borrarImgPelicula,
};
