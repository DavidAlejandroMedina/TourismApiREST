const { Schema, model } = require('mongoose');

const CastingSchema = Schema({
    heroes_id: {
        type: Schema.Types.ObjectId,
        ref: 'Heroe'
    },    
    peliculas_id: {
        type: Schema.Types.ObjectId,
        ref: 'Pelicula'
    },  
});


CastingSchema.methods.toJSON = function() {
    const { __v, ...data  } = this.toObject();
    return data;
}

module.exports = model( 'Casting', CastingSchema );