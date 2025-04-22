const sequelize = require('../db')

const Categoria = require('./Categorias')
const Producto = require('./Productos')
const Cliente = require('./Clientes')
const DetallePedido= require('./DetallePedido')
const Empleado= require('./Empleado')
const EstadoPedido= require('./EstadoPedido')
const Factura= require('./Factura')
const HistorialEstado= require('./HistorialEstado')
const Pedido= require('./Pedido')
const Proyecto= require('./Proyecto')

const db={
    sequelize,
    Categoria,
    Producto,
    Cliente,
    DetallePedido,
    Empleado,
    EstadoPedido,
    Factura,
    HistorialEstado,
    Pedido,
    Proyecto
}

module.exports= db