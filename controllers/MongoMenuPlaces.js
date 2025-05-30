const { response } = require("express");
const { MenuPlaceMongo } = require("../models");
const { isValidObjectId } = require("../helpers/mongo-verify");
const { now } = require("mongoose");


const getMenuPlaces = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    //const query = { estado: true };

    try {
        const [total, menuPlaces] = await Promise.all([
            MenuPlaceMongo.countDocuments(),
            MenuPlaceMongo.find({})
            .skip(Number(desde))
            //.limit(Number(limite)),
        ]);

        res.json({ Ok: true, total: total, resp: menuPlaces });
    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

const getMenuPlace = async (req, res = response) => {
    const { id } = req.params;
    
    try {
        const menuPlace = await MenuPlaceMongo.findById(id);
        
        res.json({ Ok: true, resp: menuPlace });
    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

const getMenuPlaceByPlace = async (req, res = response) => {
    const { id } = req.params;

    try {
        const menuPlace = await MenuPlaceMongo.find({ place_id: id });

        res.json({ Ok: true, resp: menuPlace });
    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

const getMenuPlaceByDish = async (req, res = response) => {
    const { id } = req.params;

    try {
        const menuPlace = await MenuPlaceMongo.find({ dish_id: id });

        res.json({ Ok: true, resp: menuPlace });
    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

const createMenuPlace = async (req, res = response) => {
    const { estado, usuario, ...body } = req.body;

    try {
        const menuPlaceDB = await MenuPlaceMongo.findOne({ place_id: body.place_id, dish_id: body.dish_id });

        if (menuPlaceDB) {
            return res.status(400).json({
                msg: `El plato: ${body.dish_id}, ya existe para este sitio`,
            });
        }

        // Generar la data a guardar
        const data = {
            ...body,
        };

        const menuPlace = new MenuPlaceMongo(data);

        // Guardar DB
        await menuPlace.save();

        res.status(201).json({ Ok: true, msg:'Plato del sitio Insertado', resp: menuPlace});
    } catch (error) {
        console.log("ERROR:INSERTAR", error);
        res.json({ Ok: false, resp: error });
    }
};

module.exports = {
    getMenuPlaces,
    getMenuPlace,
    getMenuPlaceByPlace,
    getMenuPlaceByDish,
    createMenuPlace,
};
