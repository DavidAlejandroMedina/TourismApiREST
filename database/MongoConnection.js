const mongoose = require('mongoose');

const bdmongo = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true
        });

        console.log('Connection OK a MongoDB.');

    } catch (error) {
        console.log(process.env.MONGODB_CNN);
        console.error('No se pudo Conectar a la BD MongoDB: ', error);
    }
}

module.exports = {
    bdmongo,
}