const  {DataTypes} = require('sequelize')
const sequelize = require('../db')

const Categoria = sequelize.define('Categoria',{
    categoriaId:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    categoria:{
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion:{
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = Categoria