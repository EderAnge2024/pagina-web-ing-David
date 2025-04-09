const Categoria= require('../models/Categorias')
const createCategoriaController = async({categoriaId, categoria, descripcion})=>{
    try {
        const newCategoria = await Categoria.create({categoriaId, categoria, descripcion})
        return newCategoria
    } catch (error) {
        throw new Error (error.message)
    }
}

const getAllCategoriaController = async ()=>{
    try {
        const categorias = await Categoria.findAll()
        return categorias
    } catch (error) {
        throw new Error(error.message)
    }
}

const updateCategoriaByIdController = async (categoriaId,categoriaData)=>{
    try {
        const categoria = await Categoria.findByPk(categoriaId)
        if(!categoria){
            return null
        }
        await categoria.update(categoriaData)
        return categoria
    } catch (error) {
        throw new Error(error)
    }
}

const deletedCategoriaByIdController = async (categoriaId)=>{
    try {
        const categoria= await Categoria.findByPk(categoriaId)
        if(!categoria){
            return null
        }
        await categoria.destroy()
        return categoria
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports={
    createCategoriaController,
    getAllCategoriaController,
    updateCategoriaByIdController,
    deletedCategoriaByIdController
}