const { response } = require("express");
const { CelebrityMongo, TagCelebrityMongo } = require("../models");
const { isValidObjectId } = require("../helpers/mongo-verify");
const { now } = require("mongoose");


const getCelebrities = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    //const query = { estado: true };

    try {
        const [total, celebrities] = await Promise.all([
            CelebrityMongo.countDocuments(),
            CelebrityMongo.find({})
            .skip(Number(desde))
            .sort({name:1})
            //.limit(Number(limite)),
        ]);

        res.json({ Ok: true, total: total, resp: celebrities });
    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

const getCelebrity = async (req, res = response) => {
    const { id } = req.params;
    try {
        const celebrity = await CelebrityMongo.findById(id);
        
        res.json({ Ok: true, resp: celebrity });
    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

const getCelebrityByProfession = async (req, res = response) => {
    const { profession } = req.params;
    try {
        const celebrity = await CelebrityMongo.find({ profession: profession });
        
        res.json({ Ok: true, resp: celebrity, msg: 'Celebridad obtenida por profesion.' });
    } catch (error) {
        res.json({ Ok: false, resp: error, msg: 'Error al obtener la celebridad por profesion.' });
    }
};

const createCelebrity = async (req, res = response) => {
    const body = req.body;
    //console.log("BODY INICIO",body);
    
    try {
        const celebrityDB = await CelebrityMongo.findOne({ name: body.name });

        if (celebrityDB) {
            return res
            //.status(400)
            .json({
                Ok: false,
                msg: `La celebridad: ${body.name}, ya existe`,
            });
        }

        //Pasa a mayuscula el dato de la categoria
        //const nombre = req.body.nombre.toUpperCase();
        
        const celebrity = new CelebrityMongo(body);
        //console.log(celebrity);

        // Guardar DB
        await celebrity.save();
        //console.log("CREADA", celebrity);

        res
        //.status(201)
        .json({ Ok: true, msg: 'Celebridad Insertada', resp: celebrity});
    } catch (error) {
        console.log("ERROR: INSERTAR",error);

        res.json({ Ok: false, msg:'Error al Insertar Celebridad', resp: error });
    }
};

const updateCelebrity = async (req, res = response) => {
    
    const { id } = req.params;
    const data  = req.body;
    // console.log(data)

    try {        
        const celebrity = await CelebrityMongo.findByIdAndUpdate(id, data, {
            new: true,
        });

        res.json({ Ok: true, msg: 'Celebridad Actualizada', resp: celebrity });
    } catch (error) {
        console.log("ERROR_MODIFICAR", error);
        res.json({ Ok: false, resp: error });
    }
};

const deleteCelebrity = async (req, res = response) => {
    const { id } = req.params;

    try {
        const [totalTagCelebrities] = await Promise.all([
            TagCelebrityMongo.countDocuments({ celebrity_id: id }),
            // TagCelebrityMongo.find({ celebrity_id: id })
            //.limit(Number(limite)),
        ]);
        // console.log(totalImagenes)
        const [totalCharacters] = await Promise.all([
            CharacterMongo.countDocuments({ celebrity_id: id }),
            // CharacterMongo.find({ celebrity_id: id })
            //.limit(Number(limite)),
        ]);
        // console.log(totalCasting)

        if (totalTagCelebrities > 0){
            return res
            //.status(400)
            .json({
                Ok: false,
                msg: `La celebridad tiene (${totalTagCelebrities}) tag celibridad asignadas y no puede ser borrado....`,
            });
        }
        else if (totalCharacters > 0){
            return res
            .json({
                Ok: false,
                msg: `La celebridad tiene (${totalCharacters}) personajes asignados y no puede ser borrado....`,
            });
        }
        else{
            const celebrityDeleted = await CelebrityMongo.findByIdAndDelete(id);

            res.json({ Ok: true, msg: 'Celebridad Borrada' }); // resp: celebrityDeleted
        }

    } catch (error) {
        console.log("ERROR_BORRADO", error);
        res.json({ Ok: false, resp: error });
    }
};

module.exports = {
    getCelebrities,
    getCelebrity,
    getCelebrityByProfession,
    createCelebrity,
    updateCelebrity,
    deleteCelebrity,
};
