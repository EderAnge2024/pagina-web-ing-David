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
  Apellidos: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Correo: {
    type: DataTypes.STRING,
    allowNull: true 
  },
  Direccion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  NumCelular: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Contraseña: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Cliente;

