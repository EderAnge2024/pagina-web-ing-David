const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const Salida = sequelize.define('Salida',{
    salidaId:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productoId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'Productos',
            key: 'productoId'
        }
    },
    clienteId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'Clientes',
            key: 'clienteId'
        }
    },
    fechaSalida:{
        type: DataTypes.DATE,
        allowNull: false
    },
    cantidad:{
        type: DataTypes.INTEGER,

        allowNull: false
    },
    precioVenta:{
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    totalPrecio:{
        type: DataTypes.DECIMAL,
        allowNull: false
    }
},{
    tableName: 'Salidas',
    timestamps: false
})

Salida.belongsTo(require('./Productos'),{foreignKey:'productoId'})
Salida.belongsTo(require('./Clientes'),{foreignKey:'clienteId'})

module.exports = Salida