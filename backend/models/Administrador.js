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
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  NumAdministrador: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Administrador;