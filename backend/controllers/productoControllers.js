const Producto= require('../models/Productos')
const createProductoController = async({ID_Producto, ID_Categoria, Codigo, Nombre_Producto, Descripcion, Descuento, Precio_Producto, Marca, Cantidad, cantidad_Disponible, Url, Precio_Final})=>{
    try {
        const newProducto = await Producto.create({ID_Producto, ID_Categoria, Codigo, Nombre_Producto, Descripcion, Descuento, Precio_Producto, Marca, Cantidad, cantidad_Disponible, Url, Precio_Final})
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

const updateProductoByIdController = async (ID_Producto,productoData)=>{
    try {
        const producto = await Producto.findByPk(ID_Producto)
        if(!producto){
            return null
        }
        await producto.update(productoData)
        return producto
    } catch (error) {
        throw new Error(error)
    }
}

const deletedProductoByIdController = async (ID_Producto)=>{
    try {
        const producto= await Producto.findByPk(ID_Producto)
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