const { response } = require("express");
const { PlaceMongo, VisitPlaceMongo, MenuPlacesMongo, CityMongo } = require("../models");

const { isValidObjectId } = require("../helpers/mongo-verify");
const { now } = require("mongoose");


const getPlaces = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    //const query = { estado: true };

    try {
        const [total, places] = await Promise.all([
            PlaceMongo.countDocuments(),
            PlaceMongo.find({})
            .skip(Number(desde))
            .sort({name:1})
            //.limit(Number(limite)),
        ]);

        res.json({ Ok: true, total: total, resp: places });
    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

const getPlace = async (req, res = response) => {
    const { id } = req.params;
    try {
        const place = await PlaceMongo.findById(id);
        
        res.json({ Ok: true, resp: place });
    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

const getPlaceByCountry = async (req, res = response) => {
    const { id } = req.params;

    try {
        // 1. Obtener las ciudades del país
        const cities = await CityMongo.find({ country_id: id }).select('_id');
        const cityIds = cities.map(city => city._id);

        // 2. Buscar lugares que estén en esas ciudades
        const places = await PlaceMongo.find({ city_id: { $in: cityIds } });

        res.json({ Ok: true, total: places.length, resp: places });
    } catch (error) {
        console.error("Error en getPlaceByCountry:", error);
        res.json({ Ok: false, resp: error, msg: 'Error al obtener los sitios por país.' });
    }
};

const createPlace = async (req, res = response) => {
    const body = req.body;
    
    try {
        // console.log("BODY INICIO",body);
        const placeDB = await PlaceMongo.findOne({ name: body.name });

        if (placeDB) {
            return res
            //.status(400)
            .json({
                Ok: false,
                msg: `El sitio: ${body.name}, ya existe.`,
            });
        }

        //Pasa a mayuscula el dato de la categoria
        //const nombre = req.body.nombre.toUpperCase();
        
        const place = new PlaceMongo(body);
        //console.log(celebrity);

        // Guardar DB
        await place.save();
        //console.log("CREADA", celebrity);

        res
        //.status(201)
        .json({ Ok: true, msg: 'Sitio Insertado', resp: place});
    } catch (error) {
        console.log("ERROR: INSERTAR",error);

        res.json({ Ok: false, msg:'Error al Insertar Sitio', resp: error });
    }
};

const updatePlace = async (req, res = response) => {
    
    const { id } = req.params;
    const data  = req.body;
    // console.log(data)

    try {        
        const place = await PlaceMongo.findByIdAndUpdate(id, data, {
            new: true,
        });

        res.json({ Ok: true, msg: 'Sitio Actualizado', resp: place });
    } catch (error) {
        console.log("ERROR_MODIFICAR", error);
        res.json({ Ok: false, resp: error });
    }
};

const deletePlace = async (req, res = response) => {
    const { id } = req.params;

    try {
        const [totalVisitPlaces] = await Promise.all([
            VisitPlaceMongo.countDocuments({ place_id: id }),
            // VisitPlaceMongo.find({ place_id: id })
            //.limit(Number(limite)),
        ]);
        // console.log(totalImagenes)
        const [totalMenuDishes] = await Promise.all([
            MenuPlacesMongo.countDocuments({ place_id: id }),
            // MenuPlacesMongo.find({ place_id: id })
            //.limit(Number(limite)),
        ]);
        // console.log(totalCasting)

        if (totalVisitPlaces > 0){
            return res
            //.status(400)
            .json({
                Ok: false,
                msg: `El sitio tiene (${totalVisitPlaces}) visitas asignadas y no puede ser borrado....`,
            });
        }
        else if (totalMenuDishes > 0){
            return res
            .json({
                Ok: false,
                msg: `El sitio tiene (${totalMenuDishes}) menú de platos asignados y no puede ser borrado....`,
            });
        }
        else{
            const placeDeleted = await PlaceMongo.findByIdAndDelete(id);

            res.json({ Ok: true, msg: 'Sitio Borrado', resp: placeDeleted }); // resp: placeDeleted
        }

    } catch (error) {
        console.log("ERROR_BORRADO", error);
        res.json({ Ok: false, resp: error });
    }
};

module.exports = {
    getPlaces,
    getPlace,
    getPlaceByCountry,
    createPlace,
    updatePlace,
    deletePlace,
};
