const {DataTypes} = require('sequelize')
const sequelize = require('../db')


const Producto = sequelize.define('Producto',{
    productoId:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    categoriaId:{
        type: DataTypes.INTEGER,
        allowNull:false,
        references:{
            model: 'Categoria',
            key: 'categoriaId'
        }
    },
    nombreProducto:{
        type: DataTypes.STRING,
        allowNull: false
    },
    fechaIngreso:{
        type: DataTypes.DATE,
        allowNull: false
    },
    fechaVencimiento:{
        type: DataTypes.DATE,
        allowNull: false
    },
    cantidadEntrada:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cantidadDisponible:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    precio:{
        type: DataTypes.DECIMAL,
        allowNull: false    
    },
    precioFinal:{
        type: DataTypes.DECIMAL,
        allowNull: false
    }
},{
    tableName: 'Productos',
    timestamps: false
})

Producto.belongsTo(require('./Categorias'),{foreignKey: 'categoriaId'})

module.exports = Producto