const { Schema, model} = require('mongoose');

const UsersSchema = Schema({
    name:{
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    mail:{
        type: String,
        required: [true, 'El correo  es obligatorio'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    rol:{
        type: String,
        required: true,
        enum: ['ADMIN_ROLE','USER_ROLE']
    },
    state:{
        type: Boolean,
        default: true
    },
    date_creation: {
        type: Date,
		default: Date.now,
		required: 'Debe tener una fecha de Creacion.'
    },
});

//Quita los campos que no quiero ver.
UsersSchema.methods.toJSON = function() {
    const {__v,password, _id, ...user} = this.toObject();
    user.uid = _id;
    return user;
}

module.exports = model('Users', UsersSchema);