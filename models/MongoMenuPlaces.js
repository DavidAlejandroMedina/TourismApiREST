const { Schema, model } = require('mongoose');

const MenuPlacesSchema = Schema({
    place_id: {
        type: Schema.Types.ObjectId,
        ref: 'Places'
    }, 
    dish_id: {
        type: Schema.Types.ObjectId,
        ref: 'Dishes'
    },
    price : {
        type: Number,
        required: [true, 'El precio es obligatorio'],
    },
});


MenuPlacesSchema.methods.toJSON = function() {
    const { __v, ...data  } = this.toObject();
    return data;
}

module.exports = model( 'Menu_Places', MenuPlacesSchema );