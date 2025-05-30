const { Schema, model } = require('mongoose');

const CountriesSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    population: {
        type: String,
        required: [true, 'La población es obligatoria'],
    },
    continent: {
        type: String,
        required: [true, 'El continente es obligatorio'],
    },
});


CountriesSchema.methods.toJSON = function() {
    const { __v, ...data  } = this.toObject();
    return data;
}

module.exports = model( 'Countries', CountriesSchema );