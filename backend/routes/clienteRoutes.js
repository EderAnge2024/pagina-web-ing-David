const {Router} = require('express')
const {createClienteController,getAllClienteController,updateClienteByIdController,deletedClienteByIdController}= require('../controllers/clienteControllers')
const {Cliente} = require ('../models')
const clienteRouters = Router()

clienteRouters.post("/",async(req, res)=>{
    const {clienteId, nombre, apellido, telefono, direccion} = req.body
    try {
        const newCliente = await createClienteController({clienteId, nombre, apellido, telefono, direccion})
        res.status(201).json(newCliente)
    } catch (error) {
        res.status(400).json({error: error.  message})
    }
})

clienteRouters.get("/",async(req,res)=>{
    try {
        const clientes = await getAllClienteController()
        res.status(200).json(clientes)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

clienteRouters.put("/:clienteId", async(req,res)=>{
    const {clienteId}= req.params
    const clienteData = req.body
    try {
        const updateCliente = await updateClienteByIdController(clienteId, clienteData)
        if(!updateCliente){
            return res.status(404).json({error: "cliente no encontrado"})
        }
        res.status(200).json(updateCliente)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

clienteRouters.delete("/:clienteId", async(req, res)=>{
    const {clienteId} = req.params
    try {
       const deletedCliente = await deletedClienteByIdController(clienteId)
       if(!deletedCliente){
        return res.status.apply(404).json({error:"cliente no encontrado"})
       }
       res. status(200).json({message: "Cliente eliminado exitosamente"})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

module.exports={
    clienteRouters
}