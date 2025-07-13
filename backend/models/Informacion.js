const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Informacion = sequelize.define('Informacion', {
  ID_Informacion: {
    type: DataTypes.INTEGER,
    primaryKey: true, 
    autoIncrement: true
  },
  Tipo_Informacion: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  Dato: {
    type: DataTypes.STRING,
    allowNull: false
  }

})

module.exports = Informacion