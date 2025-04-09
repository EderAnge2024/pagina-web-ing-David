const {Router} = require('express')
const {createCategoriaController,getAllCategoriaController,updateCategoriaByIdController,deletedCategoriaByIdController}= require('../controllers/categoriaControllers')
const {Categoria} = require ('../models')
const categoriaRouters = Router()

categoriaRouters.post("/",async(req, res)=>{
    const {categoriaId, categoria, descripcion} = req.body
    try {
        const newCategoria = await createCategoriaController({categoriaId, categoria, descripcion})
        res.status(201).json(newCategoria)
    } catch (error) {
        res.status(400).json({error: error.  message})
    }
})

categoriaRouters.get("/",async(req,res)=>{
    try {
        const categorias = await getAllCategoriaController()
        res.status(200).json(categorias)
    } catch (error) {
        res.status(400).json({error: error.message}) 
    }
})

categoriaRouters.put("/:categoriaId", async(req,res)=>{
    const {categoriaId}= req.params
    const categoriaData = req.body
    try {
        const updateCategoria = await updateCategoriaByIdController(categoriaId, categoriaData)
        if(!updateCategoria){
            return res.status(404).json({error: "Categoria no encontrado"})
        }
        res.status(200).json(updateCategoria)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

categoriaRouters.delete("/:categoriaId", async(req, res)=>{
    const {categoriaId} = req.params
    try {
       const deletedCategoria = await deletedCategoriaByIdController(categoriaId)
       if(!deletedCategoria){
        return res.status.apply(404).json({error:"Categoria no encontrado"})
       }
       res. status(200).json({message: "Categoria eliminado exitosamente"})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

module.exports={
    categoriaRouters
}