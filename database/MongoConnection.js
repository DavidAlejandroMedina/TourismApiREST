const mongoose = require('mongoose');

const bdmongo = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI,{
            serverSelectionTimeoutMS: 50000 // 50 segundos
        });
        console.log('Conexión exitosa a MongoDB');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        throw error; // Asegúrate de relanzar el error para manejarlo en server.js
    }
}

module.exports = {
    bdmongo,
}