const {Router} = require('express')
const {createSalidaController,getAllSalidaController,updateSalidaByIdController,deletedSalidaByIdController}= require('../controllers/salidaControllers')
const {Salida} = require ('../models')
const salidaRouters = Router()

salidaRouters.post("/",async(req, res)=>{
    const {salidaId, productoId, clienteId,fechaSalida,cantidad,precioVenta,totalPrecio} = req.body
    try {
        const newSalida = await createSalidaController({salidaId, productoId, clienteId,fechaSalida,cantidad,precioVenta,totalPrecio})
        res.status(201).json(newSalida)
    } catch (error) {
        res.status(400).json({error: error.  message})
    }
})

salidaRouters.get("/",async(req,res)=>{
    try {
        const salidas = await getAllSalidaController()
        res.status(200).json(salidas)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

salidaRouters.put("/:salidaId", async(req,res)=>{
    const {salidaId}= req.params
    const salidaData = req.body
    try {
        const updateSalida = await updateSalidaByIdController(salidaId, salidaData)
        if(!updateSalida){
            return res.status(404).json({error: "Salida no encontrado"})
        }
        res.status(200).json(updateSalida)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

salidaRouters.delete("/:salidaId", async(req, res)=>{
    const {salidaId} = req.params
    try {
       const deletedSalida = await deletedSalidaByIdController(salidaId)
       if(!deletedSalida){
        return res.status.apply(404).json({error:"Salida no encontrado"})
       }
       res. status(200).json({message: "Salida eliminado exitosamente"})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

module.exports={
    salidaRouters
}