const { Schema, model } = require('mongoose');

const ImgHeroeSchema = Schema({
    heroes_id: {
        type: Schema.Types.ObjectId,
        ref: 'Heroe'
    },    
    imagenes_id: {
        type: Schema.Types.ObjectId,
        ref: 'Imagene'
    },  
});


ImgHeroeSchema.methods.toJSON = function() {
    const { __v, ...data  } = this.toObject();
    return data;
}

module.exports = model( 'Img_Heroe', ImgHeroeSchema );