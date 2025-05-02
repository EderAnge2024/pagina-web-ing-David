const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Administrador = sequelize.define('Administrador', {
  ID_Administrador: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre_Administrador: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Usuario:{
     type: DataTypes.STRING,
     allowNull: false
  },
  Contrasena: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Administrador;