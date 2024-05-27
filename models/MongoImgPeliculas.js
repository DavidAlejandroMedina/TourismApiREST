const { Schema, model } = require('mongoose');

const ImgPeliculaSchema = Schema({
    peliculas_id: {
        type: Schema.Types.ObjectId,
        ref: 'Pelicula'
    },    
    imagenes_id: {
        type: Schema.Types.ObjectId,
        ref: 'Imagene'
    },  
});


ImgPeliculaSchema.methods.toJSON = function() {
    const { __v, ...data  } = this.toObject();
    return data;
}

module.exports = model( 'Img_Pelicula', ImgPeliculaSchema );