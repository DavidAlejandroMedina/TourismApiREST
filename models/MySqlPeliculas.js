const { DataTypes } = require('sequelize');
const { bdmysql } = require('../database/MySqlConnection');


const Peliculas = bdmysql.define('peliculas',
    {
        // 'id': {
        //     type: DataTypes.INTEGER,
        //     primaryKey: true
        // },
        'titulo': {
            type: DataTypes.STRING,
            allowNull: false
        },
        'descripcion': {
            type: DataTypes.TEXT,
            allowNull: false
        },
        'fecha_lanzamiento': {
            type: DataTypes.DATE
        },
        'img': {
            type: DataTypes.STRING,
        }
    },
    {
        freezeTableName: true,

        // I don't want createdAt
        createdAt: false,

        // I don't want updatedAt
        updatedAt: false
    }
);


module.exports = {
    Peliculas
}