const { Schema, model } = require('mongoose');

const DishesSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    img: {
        type: String,
        required: [true, 'La imagen es obligatoria'],
    },
    description: {
        type: String,
        required: [true, 'La descripcion es obligatoria'],
    },
    city_id: {
        type: Schema.Types.ObjectId,
        ref: 'Cities',
    },
});


DishesSchema.methods.toJSON = function() {
    const { __v, ...data  } = this.toObject();
    return data;
}

module.exports = model( 'Dishes', DishesSchema );