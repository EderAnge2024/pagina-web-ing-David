const {DataTypes} = require('sequelize')
const sequelize = require('../db')


const Pedido = sequelize.define('Pedido',{
    ID_Pedido:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ID_Cliente:{
        type: DataTypes.INTEGER,
        allowNull:false,
        references:{
            model: 'Clientes',
            key: 'ID_Cliente'
        }
    },
    Fecha_Pedido:{
        type: DataTypes.DATE,
        allowNull: false
    },
    Fecha_Entrega:{
        type: DataTypes.DATE,
        allowNull: false
    }
},{
    tableName: 'Pedidos',
    timestamps: false
})

Pedido.belongsTo(require('./Clientes'),{foreignKey: 'ID_Cliente'})

module.exports = Pedido