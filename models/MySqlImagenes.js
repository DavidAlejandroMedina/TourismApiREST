const { DataTypes } = require('sequelize');
const { bdmysql } = require('../database/MySqlConnection');

const Imagenes = bdmysql.define('imagenes', 
    {
        // 'id': {
        //     type: DataTypes.INTEGER,
        //     //allowNull: false,
        //     primaryKey: true
        // },
        'descripcion': {
            type: DataTypes.STRING,
            allowNull: false
        },
        'url': {
            type: DataTypes.STRING,
            allowNull: false
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
    Imagenes
}