const sequelize = require('../db')

const Categoria = require('./Categorias')
const Producto = require('./Productos')
const Cliente = require('./Clientes')
const Salida = require('./Salidas')
const Pedido = require('./Pedidos')

const db={
    sequelize,
    Categoria,
    Producto,
    Cliente,
    Salida,
    Pedido
}

module.exports= db