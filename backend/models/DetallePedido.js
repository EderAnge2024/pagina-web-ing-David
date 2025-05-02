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
    allowNull: false,
    references:{
      model: 'Pedidos',
      key: 'ID_Pedido'
  }
  },
  ID_Producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
      model: 'Productos',
      key: 'ID_Producto'
    }
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
},{
  tableName: 'PedidoDetalles',
  timestamps: false
});

PedidoDetalle.belongsTo(require('./Pedidos'),{foreignKey: 'ID_Pedido'})
PedidoDetalle.belongsTo(require('./Productos'),{foreignKey: 'ID_Producto'})

module.exports = PedidoDetalle;