const Producto = require('../models/Productos');


const createProductoController = async (data) => {
    try {
        const newProducto = await Producto.create(data);
        return newProducto;
    } catch (error) {
        throw new Error(error.message);
    }
};


const getAllProductosController = async () => {
    try {
        const productos = await Producto.findAll({
            include: ['Categoria'] 
        });
        return productos;
    } catch (error) {
        throw new Error(error.message);
    }
};


const getProductoByIdController = async (ID_Producto) => {
    try {
        const producto = await Producto.findByPk(ID_Producto);
        return producto;
    } catch (error) {
        throw new Error(error.message);
    }
};


const updateProductoByIdController = async (ID_Producto, productoData) => {
    try {
        const producto = await Producto.findByPk(ID_Producto);
        if (!producto) {
            return null;
        }
        await producto.update(productoData);
        return producto;
    } catch (error) {
        throw new Error(error.message);
    }
};


const deleteProductoByIdController = async (ID_Producto) => {
    try {
        const producto = await Producto.findByPk(ID_Producto);
        if (!producto) {
            return null;
        }
        await producto.destroy();
        return producto;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    createProductoController,
    getAllProductosController,
    getProductoByIdController,
    updateProductoByIdController,
    deleteProductoByIdController
};
