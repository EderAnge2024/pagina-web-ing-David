const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Imagen = sequelize.define('Imagen', {
  ID_Imagen: {
    type: DataTypes.INTEGER,
    primaryKey: true, 
    autoIncrement: true
  },
  Tipo_Imagen: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  URL: {
    type: DataTypes.STRING,
    allowNull: false
  },
  es_principal: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
})

module.exports = Imagen