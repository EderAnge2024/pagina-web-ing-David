const {Router} = require('express')
const {createProductoController,getAllProductoController,updateProductoByIdController,deletedProductoByIdController}= require('../controllers/productoControllers')
const {Producto} = require ('../models')
const productoRouters = Router()

productoRouters.post("/",async(req, res)=>{
    const {productoId, categoriaId, nombreProducto, fechaIngreso, fechaVencimiento, cantidadEntrada,cantidadDisponible, precio, precioFinal} = req.body
    try {
        const newProducto = await createProductoController({productoId, categoriaId, nombreProducto, fechaIngreso, fechaVencimiento, cantidadEntrada,cantidadDisponible, precio, precioFinal})
        res.status(201).json(newProducto)
    } catch (error) {
        res.status(400).json({error: error.  message})
    }
})

productoRouters.get("/",async(req,res)=>{
    try {
        const productos = await getAllProductoController()
        res.status(200).json(productos)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

productoRouters.put("/:productoId", async(req,res)=>{
    const {productoId}= req.params
    const productoData = req.body
    try {
        const updateProducto = await updateProductoByIdController(productoId, productoData)
        if(!updateProducto){
            return res.status(404).json({error: "Producto no encontrado"})
        }
        res.status(200).json(updateProducto)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

productoRouters.delete("/:productoId", async(req, res)=>{
    const {productoId} = req.params
    try {
       const deletedProducto = await deletedProductoByIdController(productoId)
       if(!deletedProducto){
        return res.status.apply(404).json({error:"Producto no encontrado"})
       }
       res. status(200).json({message: "Producto eliminado exitosamente"})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

module.exports={
    productoRouters
}