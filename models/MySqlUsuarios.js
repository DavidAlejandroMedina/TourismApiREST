const { DataTypes } = require('sequelize');
const { bdmysql } = require('../database/MySqlConnection');


const Usuarios = bdmysql.define('usuarios',
    {
        // Model attributes are defined here
        'nombre': {
            type: DataTypes.STRING,
            allowNull: false
        },
        'correo': {
            type: DataTypes.STRING,
            allowNull: false
            // allowNull defaults to true
        },
        'password': {
            type: DataTypes.STRING,
            allowNull: false
            // allowNull defaults to true
        },
        'img': {
            type: DataTypes.STRING
            // allowNull defaults to true
        },
        'rol': {
            type: DataTypes.ENUM('ADMIN_ROLE', 'USER_ROLE'),
            allowNull: false
            // allowNull defaults to true
        },
        'estado': {
            type: DataTypes.BOOLEAN
            // allowNull defaults to true
        },
        'google': {
            type: DataTypes.BOOLEAN
            // allowNull defaults to true
        },
        'brandProviderId': {
            type: DataTypes.INTEGER
            // allowNull defaults to true
        },
    }, 
    {
        //Maintain table name don't plurilize
        freezeTableName: true,

        // I don't want createdAt
        createdAt: false,

        // I don't want updatedAt
        updatedAt: false
    }
);


module.exports = {
    Usuarios
}
