const { Schema, model } = require('mongoose');

const ImagenSchema = Schema({
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
    },
    url: {
        type: String,
        required: [true, 'La url de la imagen es obligatoria'],
    }
});


ImagenSchema.methods.toJSON = function() {
    const { __v, ...data  } = this.toObject();
    return data;
}

module.exports = model( 'Imagene', ImagenSchema );