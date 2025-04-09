const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Cliente = sequelize.define('Cliente', {
  clienteId: {
    type: DataTypes.INTEGER,
    primaryKey: true, 
    autoIncrement: true
  },
  nombre: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefono: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

module.exports = Cliente