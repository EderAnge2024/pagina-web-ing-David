const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const EstadoPedido = sequelize.define('EstadoPedido', {
  ID_Estado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Estado: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = EstadoPedido;
