const {DataTypes} = require('sequelize')
const sequelize = require('../db')


const Producto = sequelize.define('Producto',{
    ID_Producto:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ID_Categoria:{
        type: DataTypes.INTEGER,
        allowNull:false,
        references:{
            model: 'Categoria',
            key: 'ID_Categoria'
        }
    },
    Codigo:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Nombre_Producto:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Descripcion:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    Descuento:{
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    Precio_Producto:{
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    Marca:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Cantidad:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cantidad_Disponible:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Url:{
        type: DataTypes.STRING,
        allowNull: false    
    },
    Precio_Final:{
        type: DataTypes.DECIMAL,
        allowNull: false
    }
},{
    tableName: 'Productos',
    timestamps: false
})

Producto.belongsTo(require('./Categorias'),{foreignKey: 'ID_Categoria'})

module.exports = Producto