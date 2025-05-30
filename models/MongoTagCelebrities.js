const { Schema, model } = require('mongoose');

const TagCelebritiesSchema = Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
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


TagCelebritiesSchema.methods.toJSON = function() {
    const { __v, ...data  } = this.toObject();
    return data;
}

module.exports = model( 'Tag_Celebrities', TagCelebritiesSchema );