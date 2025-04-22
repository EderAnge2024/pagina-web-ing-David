const Categoria= require('../models/Categorias')
const createCategoriaController = async({ID_Categoria, Tipo_Producto,Descripcion})=>{
    try {
        const newCategoria = await Categoria.create({ID_Categoria, Tipo_Producto,Descripcion})
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

const updateCategoriaByIdController = async (ID_Categoria,categoriaData)=>{
    try {
        const categoria = await Categoria.findByPk(ID_Categoria)
        if(!categoria){
            return null
        }
        await categoria.update(categoriaData)
        return categoria
    } catch (error) {
        throw new Error(error)
    }
}

const deletedCategoriaByIdController = async (ID_Categoria)=>{
    try {
        const categoria= await Categoria.findByPk(ID_Categoria)
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