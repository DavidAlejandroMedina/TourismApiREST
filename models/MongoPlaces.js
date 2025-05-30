const { Schema, model } = require('mongoose');

const PlacesSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    img: {
        type: String,
        required: [true, 'La imagen es obligatoria'],
    },
    type: {
        type: String,
        required: [true, 'El tipo es obligatorio'],
    },
    city_id: {
        type: Schema.Types.ObjectId,
        ref: 'Cities',
    },
});


PlacesSchema.methods.toJSON = function() {
    const { __v, ...data  } = this.toObject();
    return data;
}

module.exports = model( 'Places', PlacesSchema );