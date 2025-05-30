const { response } = require("express");
const { TagCelebrityMongo } = require("../models");
const { isValidObjectId } = require("../helpers/mongo-verify");
const { now } = require("mongoose");


const getTagCelebrities = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;

    try {
        const [total, tagCelebrities] = await Promise.all([
            TagCelebrityMongo.countDocuments(),
            TagCelebrityMongo.find({})
            .skip(Number(desde))
            //.limit(Number(limite)),
        ]);

        res.json({ Ok: true, total: total, resp: tagCelebrities });
    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

const getTagCelebrity = async (req, res = response) => {
    const { id } = req.params;
    try {
        const tagCelebrity = await TagCelebrityMongo.findById(id);
        
        res.json({ Ok: true, resp: tagCelebrity });
    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

const getTagCelebritiesByUser = async (req, res = response) => {
    const { id } = req.params;
    try {
        const tagCelebrity = await TagCelebrityMongo.find({ user_id: id });
        
        res.json({ Ok: true, resp: tagCelebrity });
    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

const createTagCelebrity = async (req, res = response) => {
    const body = req.body;
    //console.log("BODY INICIO",body);
    
    try {
        // Generar la data a guardar
        const data = {
            ...body,
        };

        const tagCelebrity = new TagCelebrityMongo(data);

        // Guardar DB
        await tagCelebrity.save();

        res.status(201).json({ Ok: true, msg:'Tag de Celebridad Insertada', resp: tagCelebrity });
    } catch (error) {
        console.log("ERROR:INSERTAR", error);
        res.json({ Ok: false, resp: error });
    }
};

const getTopCelebritiesByTags = async (req, res) => {
    try {
        const topCelebrities = await TagCelebrityMongo.aggregate([
            // Agrupar por celebrity_id y contar etiquetas
            {
                $group: {
                _id: '$celebrity_id',
                total_tags: { $sum: 1 }
                }
            },
            // Ordenar por mayor número de etiquetas
            {
                $sort: { total_tags: -1 }
            },
            // Limitar a top 5
            {
                $limit: 5
            },
            // Hacer join con la colección de celebridades
            {
                $lookup: {
                from: 'celebrities',
                localField: '_id',
                foreignField: '_id',
                as: 'celebrity'
                }
            },
            // Desenrollar el array de celebridades
            {
                $unwind: '$celebrity'
            },
            // Proyección: mostrar solo campos necesarios
            {
                $project: {
                _id: 0,
                celebrity_id: '$celebrity._id',
                name: '$celebrity.name',
                // profession: '$celebrity.profession',
                img: '$celebrity.img',
                total_tags: 1
                }
            }
        ]);

        res.json({ok: true, topCelebrities });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener el top de celebridades por etiquetas' });
    }
};


// const obtenerImgXIdPelicula = async (req, res = response) => {
//     const { id } = req.params;
//     //const { limite = 5, desde = 0 } = req.query;
//     const query = { peliculas_id: id};

//     try {

//         const [total, imgPelicula ] = await Promise.all([
//             ImgPeliculaMongo.countDocuments(query),
//             ImgPeliculaMongo.find(query)
//             .populate("imagenes_id", "url"),
//           //.skip(Number(desde))
//           //.limit(Number(limite)),
//         ]);

//         res.json({ Ok: true, total: total, resp: imgPelicula });
//     } catch (error) {
//         console.log(error);
//         res.json({ Ok: false, resp: error });
//     }
// };


module.exports = {
    getTagCelebrities,
    getTagCelebrity,
    getTagCelebritiesByUser,
    createTagCelebrity,
    getTopCelebritiesByTags,
};
