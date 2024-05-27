const { DataTypes } = require('sequelize');
const { bdmysql } = require('../database/MySqlConnection');

const ImgPeliculas = bdmysql.define('img_peliculas', 
    {
        'peliculas_id': {
            type: DataTypes.INTEGER,
            references: {
                model: 'peliculas',
                key: 'id'
            }
        },
        // Referencia al modelo 'imagenes'
        'imagenes_id': {
            type: DataTypes.INTEGER,
            references: {
                model: 'imagenes',
                key: 'id'
            }
        }
    },
    {
        freezeTableName: true,

        // I don't want createdAt
        createdAt: false,

        // I don't want updatedAt
        updatedAt: false
    }
)

module.exports = {
    ImgPeliculas
}