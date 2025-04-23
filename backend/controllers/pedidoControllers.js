const Pedido= require('../models/Pedidos')
const createPedidoController = async({ID_Pedido, ID_Cliente, Fecha_Pedido, Fecha_Entrega})=>{
    try {
        const newPedido = await Pedido.create({ID_Pedido, ID_Cliente, Fecha_Pedido, Fecha_Entrega})
        return newPedido
    } catch (error) {
        throw new Error (error.message)
    }
}

const getAllPedidoController = async ()=>{
    try {
        const pedidos = await Pedido.findAll()
        return pedidos
    } catch (error) {
        throw new Error(error.message)
    }
}

const updatePedidoByIdController = async (ID_Pedido,pedidoData)=>{
    try {
        const pedido = await Pedido.findByPk(ID_Pedido)
        if(!pedido){
            return null
        }
        await pedido.update(pedidoData)
        return pedido
    } catch (error) {
        throw new Error(error)
    }
}

const deletedPedidoByIdController = async (ID_Pedido)=>{
    try {
        const pedido= await Pedido.findByPk(ID_Pedido)
        if(!pedido){
            return null
        }
        await pedido.destroy()
        return pedido
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports={
    createPedidoController,
    getAllPedidoController,
    updatePedidoByIdController,
    deletedPedidoByIdController
}