const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Empleado = sequelize.define('Empleado', {
  ID_Empleado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre_Empleado: {
    type: DataTypes.STRING,
    allowNull: false
  },
  NumCelular:{
     type: DataTypes.INTEGER,
     allowNull: false
  },
  URL: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Empleado;