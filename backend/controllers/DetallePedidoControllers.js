const PedidoDetalle = require('../models/DetallePedido');


const createPedidoDetalleController = async ({ ID_Pedido, ID_Producto, Cantidad, Precio_Unitario, Descuento, Subtotal }) => {
    try {
        const newDetalle = await PedidoDetalle.create({
            ID_Pedido,
            ID_Producto,
            Cantidad,
            Precio_Unitario,
            Descuento,
            Subtotal
        });
        return newDetalle;
    } catch (error) {
        throw new Error(error.message);
    }
};


const getAllPedidoDetallesController = async () => {
    try {
        const detalles = await PedidoDetalle.findAll();
        return detalles;
    } catch (error) {
        throw new Error(error.message);
    }
};


const updatePedidoDetalleByIdController = async (ID_Detalle, detalleData) => {
    try {
        const detalle = await PedidoDetalle.findByPk(ID_Detalle);
        if (!detalle) {
            return null;
        }
        await detalle.update(detalleData);
        return detalle;
    } catch (error) {
        throw new Error(error.message);
    }
};


const deletePedidoDetalleByIdController = async (ID_Detalle) => {
    try {
        const detalle = await PedidoDetalle.findByPk(ID_Detalle);
        if (!detalle) {
            return null;
        }
        await detalle.destroy();
        return detalle;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    createPedidoDetalleController,
    getAllPedidoDetallesController,
    updatePedidoDetalleByIdController,
    deletePedidoDetalleByIdController
};