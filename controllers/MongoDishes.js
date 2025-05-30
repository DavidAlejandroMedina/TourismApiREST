const { response } = require("express");
const { DishMongo, CityMongo } = require("../models");
const { isValidObjectId } = require("../helpers/mongo-verify");
const { now } = require("mongoose");


const getDishes = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    
    try {
        const [total, dishes] = await Promise.all([
            DishMongo.countDocuments(),
            DishMongo.find({})
            .skip(Number(desde))
            //.limit(Number(limite)),
        ]);

        res.json({ Ok: true, total: total, resp: dishes });
    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

const getDish = async (req, res = response) => {
    const { id } = req.params;
    try {
        const dish = await DishMongo.findById(id);
        
        res.json({ Ok: true, resp: dish });
    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

// FALTA REALIZAR LA OBTENCIÓN DEL PAÍS
const getDishesByCountry = async (req, res = response) => {
    const { id } = req.params; // id de la ciudad

    try {
        const cities = await CityMongo.find({ country_id: id }).select('_id');
        const cityIds = cities.map(city => city._id);

        // 2. Buscar lugares que estén en esas ciudades
        const dishes = await DishMongo.find({ city_id: { $in: cityIds } });

        // const city = await CityMongo.findById(id);
        
        res.json({ Ok: true, total: dishes.length, resp: dishes });
    } catch (error) {
        res.json({ Ok: false, resp: error , msg: 'Error al obtener los platos por país.' });
    }
};

const createDish = async (req, res = response) => {
    const body = req.body;
    //console.log("BODY INICIO",body);
    
    try {
        const dishDB = await DishMongo.findOne({ name: body.name });

        if (dishDB) {
            return res
            //.status(400)
            .json({
                Ok: false,
                msg: `El plato: ${body.name}, ya existe`,
            });
        }

        //Pasa a mayuscula el dato de la categoria
        //const nombre = req.body.nombre.toUpperCase();
        
        const dish = new DishMongo(body);
        //console.log(celebrity);

        // Guardar DB
        await dish.save();
        //console.log("CREADA", celebrity);

        res
        //.status(201)
        .json({ Ok: true, msg: 'Plato Insertado', resp: dish});
    } catch (error) {
        console.log("ERROR: INSERTAR", error);

        res.json({ Ok: false, msg:'Error al Insertar Plato', resp: error });
    }
};


module.exports = {
    getDishes,
    getDish,
    getDishesByCountry,
    createDish,
};