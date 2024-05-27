const { DataTypes } = require('sequelize');
const { bdmysql } = require('../database/MySqlConnection');

const CastingPelicula = bdmysql.define('casting_pelicula',
    {
        // 'id': {
        //     type: DataTypes.INTEGER,
        //     //allowNull: false,
        //     primaryKey: true
        // },
        'personaje': {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Referencia al modelo 'peliculas'
        'peliculas_id': {
            type: DataTypes.INTEGER,
            references: {
                model: 'peliculas',
                key: 'id'
            }
        },
        // Referencia al modelo 'heroes'
        'heroes_id': {
            type: DataTypes.INTEGER,
            references: {
                model: 'heores',
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
);


module.exports = {
    CastingPelicula
}