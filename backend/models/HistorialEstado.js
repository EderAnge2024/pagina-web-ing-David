const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const HistorialEstado = sequelize.define('HistorialEstado', {
  ID_Pedido: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ID_Estado: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Fecha: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

module.exports = HistorialEstado;