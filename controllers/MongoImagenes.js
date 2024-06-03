const { response } = require("express");
const { ImagenMongo, ImgHeroeMongo, ImgPeliculaMongo } = require("../models");

const { isValidObjectId } = require("../helpers/mongo-verify");
const { now } = require("mongoose");


const obtenerImagenes = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    //const query = { estado: true };

    try {
        const [total, imagenes] = await Promise.all([
            ImagenMongo.countDocuments(),
            ImagenMongo.find({})
            .skip(Number(desde))
            .sort({nombre:1}) // Ordena por descripcion
            //.limit(Number(limite)),
        ]);

        res.json({ Ok: true, total: total, resp: imagenes });
    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

const obtenerImagen = async (req, res = response) => {
    const { id } = req.params;
    try {
        const imagen = await ImagenMongo.findById(id);
        
        res.json({ Ok: true, resp: imagen });
    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

const crearImagen = async (req, res = response) => {

    const body = req.body;
    //console.log("BODY INICIO",body);
    
    try {
        const imagenDB = await ImagenMongo.findOne({ descripcion: body.descripcion, url: body.url });

        if (imagenDB) {
            return res
            //.status(400)
            .json({
                Ok: false,
                msg: `La url con esa descripción, ya existe`,
            });
        }

        const imagen = new ImagenMongo(body);

        // Guardar en BD
        await imagen.save();

        res.json({ Ok: true, msg: 'Imagen Insertada', resp: imagen });

    } catch (error) {
        console.log("ERROR:INSERTAR",error);
        res.json({ Ok: false, msg:'Error al Insertar Imagen', resp: error });
    }
};

const actualizarImagen = async (req, res = response) => {
    const { id } = req.params;
    const data = req.body;
    // console.log("DATA",data)

    try {
        if (data.url) {
            const imagenDB = await ImagenMongo.findOne({ descripcion: body.descripcion, url: data.url });

            // console.log("IMAGEN_DB",imagenDB);

            if (imagenDB) {
            return res.status(400).json({
                msg: `La url con esa descripción, ya existe`,
            });
            }
        }

        const imagen = await ImagenMongo.findByIdAndUpdate(id, data, { new: true });

        console.log("IMAGEN",imagen);

        res.json({ Ok: true, msg: 'Imagen Actualizada',resp: imagen });
    } catch (error) {
        console.log("ERROR_MODIFICAR",error);
        res.json({ Ok: false, resp: error });
    }
};

const borrarImagen = async (req, res = response) => {
    const { id } = req.params;

    try {
        const [totalImgHeroes] = await Promise.all([
            ImgHeroeMongo.countDocuments({ imagenes_id: id }),
            // ImgHeroeMongo.find({ peliculas_id: id })
            //.limit(Number(limite)),
        ]);
        const [totalImgPeliculas] = await Promise.all([
            ImgPeliculaMongo.countDocuments({ imagenes_id: id }),
            // ImgPeliculaMongo.find({ peliculas_id: id })
            //.limit(Number(limite)),
        ]);

        if (totalImgHeroes > 0){
            return res
            //.status(400)
            .json({
                Ok: false,
                msg: `La Imagen tiene (${totalImgHeroes}) heroes asignados y no puede ser borrada....`,
            });
        }
        else if (totalImgPeliculas > 0){
            return res
            //.status(400)
            .json({
                Ok: false,
                msg: `La Imagen tiene (${totalImgPeliculas}) películas asignadas y no puede ser borrada....`,
            });
        }
        else{
            const imagenBorrada = await ImagenMongo.findByIdAndDelete(id);

            res.json({ Ok: true, msg: 'Imagen Borrada', resp: imagenBorrada });
        }
    } catch (error) {
        console.log("ERROR_BORRADO",error);
        res.json({ Ok: false, resp: error });
    }
};

module.exports = {
    obtenerImagenes,
    obtenerImagen,
    crearImagen,
    actualizarImagen,
    borrarImagen
};