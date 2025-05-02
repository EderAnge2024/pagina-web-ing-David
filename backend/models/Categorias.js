const  {DataTypes} = require('sequelize')
const sequelize = require('../db')

const Categoria = sequelize.define('Categoria',{
    ID_Categoria:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    Tipo_Producto:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Descripcion:{
        type: DataTypes.TEXT,
        allowNull: false
    }
})

module.exports = Categoria