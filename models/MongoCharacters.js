const { Schema, model } = require('mongoose');

const CharactersSchema = Schema({
    city_id: {
        type: Schema.Types.ObjectId,
        ref: 'Cities',
    },    
    celebrity_id: {
        type: Schema.Types.ObjectId,
        ref: 'Celebrities'
    },
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
});


CharactersSchema.methods.toJSON = function() {
    const { __v, ...data  } = this.toObject();
    return data;
}

module.exports = model( 'Characters', CharactersSchema );