const { response } = require("express");
const { VisitPlaceMongo, PlaceMongo } = require("../models");
const { isValidObjectId } = require("../helpers/mongo-verify");
const { now } = require("mongoose");
const mongoose = require("mongoose");


const getVisitPlaces = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    //const query = { estado: true };
    try {
        const [total, visitPlaces] = await Promise.all([
            VisitPlaceMongo.countDocuments(),
            VisitPlaceMongo.find({})
            .skip(Number(desde))
            // .sort({user_id:1})
            //.limit(Number(limite)),
        ]);

        res.json({ Ok: true, total: total, resp: visitPlaces });
    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

const getVisitPlaceByUser = async (req, res = response) => {
    const { id } = req.params;
    try {
        const visitPlace = await VisitPlaceMongo.find({ user_id: id });
        
        res.json({ Ok: true, resp: visitPlace });
    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

const getTopVisitPlacesByCountry = async (req, res = response) => {
    const { id } = req.params;

    try {
        const topVisitPlaces = await VisitPlaceMongo.aggregate([
            // 1. Join con Places
            {
                $lookup: {
                from: "places",
                localField: "place_id",
                foreignField: "_id",
                as: "place"
                }
            },
            { $unwind: "$place" },

            // 2. Join con Cities
            {
                $lookup: {
                from: "cities",
                localField: "place.city_id",
                foreignField: "_id",
                as: "city"
                }
            },
            { $unwind: "$city" },

            // 3. Join con Countries
            {
                $lookup: {
                from: "countries",
                localField: "city.country_id",
                foreignField: "_id",
                as: "country"
                }
            },
            { $unwind: "$country" },

            // 4. Filtrar por país recibido en la URL
            {
                $match: {
                "country._id": new mongoose.Types.ObjectId(id)
                }
            },

            // 5. Agrupar por sitio
            {
                $group: {
                _id: "$place._id",
                name: { $first: "$place.name" },
                visits: { $sum: 1 }
                }
            },

            // 6. Ordenar y limitar
            { $sort: { visits: -1 } },
            { $limit: 10 }
        ]);

        res.json({ Ok: true, resp: topVisitPlaces });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: 'Error al obtener los sitios más visitados.' });
    }
};

const getTopUsersByVisits = async (req, res = response) => {
    try {
        const topUsers = await VisitPlaceMongo.aggregate([
            // Agrupamos por usuario y contamos cuántas visitas tiene
            {
                $group: {
                _id: "$user_id",
                total_visits: { $sum: 1 }
                }
            },
            // Ordenamos por total de visitas descendente
            {
                $sort: { total_visits: -1 }
            },
            // Opcional: limitamos a los top 5
            {
                $limit: 5
            },
            // Join con la colección de usuarios para obtener sus datos
            {
                $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "user"
                }
            },
            { $unwind: "$user" },
            // Proyección para mostrar solo lo necesario
            {
                $project: {
                _id: 0,
                user_id: "$user._id",
                name: "$user.name",
                // email: "$user.mail",
                total_visits: 1
                }
            }
        ]);

        res.json({ ok: true, topUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: "Error al obtener usuarios con más visitas" });
    }
};


const createVisitPlace = async (req, res = response) => {
    const body = req.body;
    
    try {
        // console.log("BODY INICIO",body);
        const visitPlaceDB = await VisitPlaceMongo.findOne({ user_id: body.user_id, place_id: body.place_id });

        if (visitPlaceDB) {
            const placeDB = await PlaceMongo.findById(body.place_id);

            return res
            //.status(400)
            .json({
                Ok: false,
                msg: `El sitio: ${placeDB.name}, ya fue visitado por este usuario`,
            });
        }

        // Generar la data a guardar
        const data = {
            ...body,
        };

        const visitPlace = new VisitPlaceMongo(data);

        // Guardar DB
        await visitPlace.save();

        res.status(201).json({ Ok: true, msg:'Sitio Visitado guardado', resp: visitPlace });
    } catch (error) {
        console.log("ERROR:INSERTAR", error);
        res.json({ Ok: false, resp: error });
    }
};

module.exports = {
    getVisitPlaces,
    getVisitPlaceByUser,
    getTopVisitPlacesByCountry,
    getTopUsersByVisits,
    createVisitPlace,
};
