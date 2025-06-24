const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Cliente = sequelize.define('Cliente', {
  ID_Cliente: {
    type: DataTypes.INTEGER,
    primaryKey: true, 
    autoIncrement: true
  },
  Nombre: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  Apellido: {
    type: DataTypes.STRING,
    allowNull: false
  },
  NumCelular: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  token:{
    type: DataTypes.STRING,
    allowNull:false
  }

})

module.exports = Cliente