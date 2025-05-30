const { response } = require("express");
const { CountryMongo, CityMongo } = require("../models");
const { isValidObjectId } = require("../helpers/mongo-verify");
const { now } = require("mongoose");


const getCountries = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    //const query = { estado: true };

    try {
        const [total, countries] = await Promise.all([
            CountryMongo.countDocuments(),
            CountryMongo.find({})
            .skip(Number(desde))
            .sort({name:1})
            //.limit(Number(limite)),
        ]);

        res.json({ Ok: true, total: total, resp: countries });
    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

const getCountry = async (req, res = response) => {
    const { id } = req.params;
    try {
        const country = await CountryMongo.findById(id);
        
        res.json({ Ok: true, resp: country });
    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

const createCountry = async (req, res = response) => {
    const body = req.body;
    //console.log("BODY INICIO",body);
    
    try {
        const countryDB = await CountryMongo.findOne({ name: body.name });

        if (countryDB) {
            return res
            //.status(400)
            .json({
                Ok: false,
                msg: `El país: ${body.name}, ya existe`,
            });
        }

        //Pasa a mayuscula el dato de la categoria
        //const nombre = req.body.nombre.toUpperCase();
        
        const country = new CountryMongo(body);
        //console.log(celebrity);

        // Guardar DB
        await country.save();
        //console.log("CREADA", country);

        res
        //.status(201)
        .json({ Ok: true, msg: 'País Insertado', resp: country});
    } catch (error) {
        console.log("ERROR: INSERTAR",error);

        res.json({ Ok: false, msg:'Error al Insertar País', resp: error });
    }
};

const updateCountry = async (req, res = response) => {
    const { id } = req.params;
    const data  = req.body;
    // console.log(data)

    try {
        const country = await CountryMongo.findByIdAndUpdate(id, data, {
            new: true,
        });

        res.json({ Ok: true, msg: 'País Actualizado', resp: country });
    } catch (error) {
        console.log("ERROR_MODIFICAR", error);
        res.json({ Ok: false, resp: error });
    }
};

const deleteCountry = async (req, res = response) => {
    const { id } = req.params;

    try {
        const [totalCities] = await Promise.all([
            CityMongo.countDocuments({ country_id: id }),
            // CityMongo.find({ country_id: id })
            //.limit(Number(limite)),
        ]);
        // console.log(totalCities)

        if (totalCities > 0){
            return res
            //.status(400)
            .json({
                Ok: false,
                msg: `El País tiene (${totalCities}) ciudades asignadas y no puede ser borrado....`,
            });
        }
        else{
            const countryDeleted = await CountryMongo.findByIdAndDelete(id);

            res.json({ Ok: true, msg: 'País Borrado' }); // resp: countryDeleted
        }

    } catch (error) {
        console.log("ERROR_BORRADO", error);
        res.json({ Ok: false, resp: error });
    }
};

module.exports = {
    getCountries,
    getCountry,    
    createCountry,
    updateCountry,
    deleteCountry
};
