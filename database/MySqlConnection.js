const { Sequelize } = require('sequelize');

const bdmysql = new Sequelize(
    process.env.NAMEDB, //Nombre de la BD
    process.env.USER, //Nombre de usuario
    '', //Contraseña
    {
        host: process.env.HOST,
        port: process.env.PORTDB,
        dialect: 'mariadb'
    }
);

// Se modulariza
module.exports = {
    bdmysql,
}