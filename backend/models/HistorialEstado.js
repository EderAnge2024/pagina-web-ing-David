const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const HistorialEstado = sequelize.define('HistorialEstado', {
  ID_Historial:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ID_EstadoPedido: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references:{
      model: 'EstadoPedidos',
      key:'ID_EstadoPedido'
    }
  },
  ID_Pedido: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
      model: 'Pedidos',
      key: 'ID_Pedido'
    }
  },
  Fecha: {
    type: DataTypes.DATE,
    allowNull: false
  }
},{
  tableName: 'HistorialEstados',
  timestamps: false
});

HistorialEstado.belongsTo(require('./EstadoPedido'),{foreignKey: 'ID_EstadoPedido'})
HistorialEstado.belongsTo(require('./Pedidos'),{foreignKey: 'ID_Pedido'})

module.exports = HistorialEstado;