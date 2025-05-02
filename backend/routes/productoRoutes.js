const {Router} = require('express')
const {createProductoController,getAllProductoController,updateProductoByIdController,deletedProductoByIdController}= require('../controllers/productoControllers')
const {Producto} = require ('../models')
const productoRouters = Router()

productoRouters.post("/",async(req, res)=>{
    const {ID_Producto, ID_Categoria, Codigo, Nombre_Producto, Descripcion, Descuento, Precio_Producto, Marca, Cantidad, cantidad_Disponible, Url, Precio_Final} = req.body
    try {
        const newProducto = await createProductoController({ID_Producto, ID_Categoria, Codigo, Nombre_Producto, Descripcion, Descuento, Precio_Producto, Marca, Cantidad, cantidad_Disponible, Url, Precio_Final})
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

productoRouters.put("/:ID_Producto", async(req,res)=>{
    const {ID_Producto}= req.params
    const productoData = req.body
    try {
        const updateProducto = await updateProductoByIdController(ID_Producto, productoData)
        if(!updateProducto){
            return res.status(404).json({error: "Producto no encontrado"})
        }
        res.status(200).json(updateProducto)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

productoRouters.delete("/:ID_Producto", async(req, res)=>{
    const {ID_Producto} = req.params
    try {
       const deletedProducto = await deletedProductoByIdController(ID_Producto)
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