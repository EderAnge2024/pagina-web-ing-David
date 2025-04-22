const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Proyecto = sequelize.define('Proyecto', {
  ID_Proyectos: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ID_Empleados: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Lugar: {
    type: DataTypes.STRING,
    allowNull: false
  },
  URL: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Proyecto;