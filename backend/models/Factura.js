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
    allowNull: false,
    references:{
      model: 'Pedidos',
      key: 'ID_Pedido'
    }
  },
  ID_Cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
      model: 'Clientes',
      key: 'ID_Cliente'
    }
  },
  Fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Monto_Total: {
    type: DataTypes.DECIMAL,
    allowNull: false
  }
},{
  tableName: 'Facturas',
  timestamps: false
});

Factura.belongsTo(require('./Pedidos'),{foreignKey: 'ID_Pedido'})
Factura.belongsTo(require('./Clientes'),{foreignKey: 'ID_Cliente'})

module.exports = Factura;