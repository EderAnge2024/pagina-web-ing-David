const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const PedidoDetalle = sequelize.define('PedidoDetalle', {
  ID_Detalle: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ID_Pedido: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ID_Producto: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Precio_Unitario: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  Descuento: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  Subtotal: {
    type: DataTypes.DECIMAL,
    allowNull: false
  }
});

module.exports = PedidoDetalle;