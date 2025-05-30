const { response } = require("express");
const { CityMongo, CelebrityMongo, CharacterMongo, PlaceMongo, DishMongo } = require("../models");

const { isValidObjectId } = require("../helpers/mongo-verify");
const { now } = require("mongoose");


const getCities = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    //const query = { estado: true };

    try {
        const [total, cities] = await Promise.all([
            CityMongo.countDocuments(),
            CityMongo.find({})
            .skip(Number(desde))
            .sort({name:1})
            //.limit(Number(limite)),
        ]);

        res.json({ Ok: true, total: total, resp: cities });
    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

const getCity = async (req, res = response) => {
    const { id } = req.params;
    try {
        const city = await CityMongo.findById(id);
        
        res.json({ Ok: true, resp: city });
    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

const createCity = async (req, res = response) => {
    const body = req.body;
    //console.log("BODY INICIO",body); 

    try {
        const cityDB = await CityMongo.findOne({ name: body.name });

        if (cityDB) {
            return res
            //.status(400)
            .json({
                Ok: false,
                msg: `La ciudad: ${body.name}, ya existe`,
            });
        }

        //Pasa a mayuscula el dato de la categoria
        //const nombre = req.body.nombre.toUpperCase();
        
        const city = new CityMongo(body);
        //console.log(celebrity);

        // Guardar DB
        await city.save();
        //console.log("CREADA", celebrity);

        res
        //.status(201)
        .json({ Ok: true, msg: 'Ciudad Insertada', resp: city});
    } catch (error) {
        console.log("ERROR: INSERTAR",error);

        res.json({ Ok: false, msg:'Error al Insertar Ciudad', resp: error });
    }
};

const deleteCity = async (req, res = response) => {
    const { id } = req.params;

    try {
        const [totalCelebrities] = await Promise.all([
            CelebrityMongo.countDocuments({ city_id: id }),
            // CelebrityMongo.find({ place_id: id })
            //.limit(Number(limite)),
        ]);
        const [totalCharacters] = await Promise.all([
            CharacterMongo.countDocuments({ city_id: id }),
            // CharacterMongo.find({ place_id: id })
            //.limit(Number(limite)),
        ]);
        const [totalDishes] = await Promise.all([
            DishMongo.countDocuments({ city_id: id }),
            // DishMongo.find({ place_id: id })
            //.limit(Number(limite)),
        ]);
        const [totalPlaces] = await Promise.all([
            PlaceMongo.countDocuments({ city_id: id }),
            // PlaceMongo.find({ place_id: id })
            //.limit(Number(limite)),
        ]);

        if (totalCelebrities > 0){
            return res
            //.status(400)
            .json({
                Ok: false,
                msg: `La ciudad tiene (${totalCelebrities}) celebridades asignadas y no puede ser borrado....`,
            });
        }
        else if (totalCharacters > 0){
            return res
            .json({
                Ok: false,
                msg: `La ciudad tiene (${totalCharacters}) personajes asignados y no puede ser borrado....`,
            });
        }
        else if (totalDishes > 0){
            return res
            .json({
                Ok: false,
                msg: `La ciudad tiene (${totalDishes}) platos asignados y no puede ser borrado....`,
            });
        }
        else if (totalPlaces > 0){
            return res
            .json({
                Ok: false,
                msg: `La ciudad tiene (${totalPlaces}) sitios asignados y no puede ser borrado....`,
            });
        }
        else{
            const cityDeleted = await CityMongo.findByIdAndDelete(id);

            res.json({ Ok: true, msg: 'Ciudad Borrada', resp: cityDeleted }); // resp: placeDeleted
        }

    } catch (error) {
        console.log("ERROR_BORRADO", error);
        res.json({ Ok: false, resp: error });

    }
};

module.exports = {
    getCities,
    getCity,
    createCity,
    deleteCity
};
