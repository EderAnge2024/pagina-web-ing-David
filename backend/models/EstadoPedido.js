const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const EstadoPedido = sequelize.define('EstadoPedido', {
  ID_EstadoPedido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Estado: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = EstadoPedido;