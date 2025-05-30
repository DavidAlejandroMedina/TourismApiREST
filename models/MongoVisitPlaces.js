const { Schema, model } = require('mongoose');

const VisitPlacesSchema = Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },    
    place_id: {
        type: Schema.Types.ObjectId,
        ref: 'Places'
    },  
    date_visit: {
        type: Date,
        default: Date.now,
        required: [true, 'La fecha de visita es obligatoria'],
    },
});


VisitPlacesSchema.methods.toJSON = function() {
    const { __v, ...data  } = this.toObject();
    return data;
}

module.exports = model( 'Visit_Places', VisitPlacesSchema );