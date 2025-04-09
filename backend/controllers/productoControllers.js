const Producto= require('../models/Productos')
const createProductoController = async({productoId, categoriaId, nombreProducto, fechaIngreso, fechaVencimiento, cantidadEntrada,cantidadDisponible, precio, precioFinal})=>{
    try {
        const newProducto = await Producto.create({productoId, categoriaId, nombreProducto, fechaIngreso, fechaVencimiento, cantidadEntrada,cantidadDisponible, precio, precioFinal})
        return newProducto
    } catch (error) {
        throw new Error (error.message)
    }
}

const getAllProductoController = async ()=>{
    try {
        const productos = await Producto.findAll()
        return productos
    } catch (error) {
        throw new Error(error.message)
    }
}

const updateProductoByIdController = async (productoId,productoData)=>{
    try {
        const producto = await Producto.findByPk(productoId)
        if(!producto){
            return null
        }
        await producto.update(productoData)
        return producto
    } catch (error) {
        throw new Error(error)
    }
}

const deletedProductoByIdController = async (productoId)=>{
    try {
        const producto= await Producto.findByPk(productoId)
        if(!producto){
            return null
        }
        await producto.destroy()
        return producto
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports={
    createProductoController,
    getAllProductoController,
    updateProductoByIdController,
    deletedProductoByIdController
}