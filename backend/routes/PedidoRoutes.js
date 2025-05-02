const {Router} = require('express')
const {createPedidoController,getAllPedidoController,updatePedidoByIdController,deletedPedidoByIdController}= require('../controllers/pedidoControllers')
const {Pedido} = require ('../models')
const pedidoRouters = Router()

pedidoRouters.post("/",async(req, res)=>{
    const {ID_Pedido, ID_Cliente, Fecha_Pedido, Fecha_Entrega} = req.body
    try {
        const newPedido = await createPedidoController({ID_Pedido, ID_Cliente, Fecha_Pedido, Fecha_Entrega})
        res.status(201).json(newPedido)
    } catch (error) {
        res.status(400).json({error: error.  message})
    }
})

pedidoRouters.get("/",async(req,res)=>{
    try {
        const pedidos = await getAllPedidoController()
        res.status(200).json(pedidos)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

pedidoRouters.put("/:ID_Pedido", async(req,res)=>{
    const {ID_Pedido}= req.params
    const pedidoData = req.body
    try {
        const updatePedido = await updatePedidoByIdController(ID_Pedido, pedidoData)
        if(!updatePedido){
            return res.status(404).json({error: "Pedido no encontrado"})
        }
        res.status(200).json(updatePedido)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

pedidoRouters.delete("/:ID_Pedido", async(req, res)=>{
    const {ID_Pedido} = req.params
    try {
       const deletedPedido = await deletedPedidoByIdController(ID_Pedido)
       if(!deletedPedido){
        return res.status.apply(404).json({error:"Pedido no encontrado"})
       }
       res. status(200).json({message: "Pedido eliminado exitosamente"})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

module.exports={
    pedidoRouters
}