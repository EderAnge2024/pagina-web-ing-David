const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Factura = sequelize.define('Factura', {
  ID_Factura: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ID_Pedido: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ID_Cliente: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Monto_Total: {
    type: DataTypes.DECIMAL,
    allowNull: false
  }
});

module.exports = Factura;
