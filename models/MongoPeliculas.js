const { Schema, model } = require('mongoose');

const PeliculaSchema = Schema({
    titulo: {
        type: String,
        required: [true, 'El titulo es obligatorio'],
        unique: true
    },
    descripcion: {
        type: String,
        required: [true, 'La descripcion es obligatoria'],
    },
    fecha_lanzamiento: {
        type: Date,
        required: [true, 'La fecha de lanzamiento es obligatoria'],
    },
    img: {
        type: String,
		required: [true, 'Debe tener una imagen inicial'],
    }
});


PeliculaSchema.methods.toJSON = function() {
    const { __v, ...data  } = this.toObject();
    return data;
}

module.exports = model( 'Pelicula', PeliculaSchema);