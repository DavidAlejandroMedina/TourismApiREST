const { Schema, model } = require('mongoose');

const CitiesSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    img: {
        type: String,
        required: [true, 'La imagen es obligatoria'],
    },
    latitude: {
        type: String,
        required: [true, 'La latitud es obligatoria'],
    },
    longitude: {
        type: String,
        required: [true, 'La longitud es obligatoria'],
    },
    country_id: {
        type: Schema.Types.ObjectId,
        ref: 'Countries',
    },
});


CitiesSchema.methods.toJSON = function() {
    const { __v, ...data  } = this.toObject();
    return data;
}

module.exports = model( 'Cities', CitiesSchema );