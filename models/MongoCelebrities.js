const { Schema, model } = require('mongoose');

const CelebritiesSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    img: {
        type: String,
        required: [true, 'La imagen es obligatoria'],
    },
    profession: {
        type: String,
        required: [true, 'La profesion es obligatoria'],
    },
    city_id: {
        type: Schema.Types.ObjectId,
        ref: 'Cities',
    }
});


CelebritiesSchema.methods.toJSON = function() {
    const { __v, ...data  } = this.toObject();
    return data;
}

module.exports = model( 'Celebrities', CelebritiesSchema );