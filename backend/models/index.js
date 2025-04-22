const sequelize = require('../db')

const Categoria = require('./Categorias')
const Producto = require('./Productos')
const Cliente = require('./Clientes')
const Pedido = require('./Pedidos')
const DetallePedido = require('./DetallePedido')
const Empleado = require('./Empleado')
const EstadoPedido  = require('./EstadoPedido')
const Factura = require('./Factura')
const HistorialEstado = require('./HistorialEstado')
const Proyecto = require('./Proyecto')

const db={
    sequelize,
    Categoria,
    Producto,
    Cliente,
    Pedido,
    DetallePedido,
    Empleado,
    EstadoPedido,
    Factura,
    HistorialEstado,
    Proyecto
}

module.exports= db