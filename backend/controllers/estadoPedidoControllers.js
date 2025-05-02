const EstadoPedido = require('../models/EstadoPedido');


const createEstadoPedidoController = async ({ ID_EstadoPedido,Estado }) => {
    try {
        const newEstado = await EstadoPedido.create({ ID_EstadoPedido,Estado });
        return newEstado;
    } catch (error) {
        throw new Error(error.message);
    }
};


const getAllEstadoPedidosController = async () => {
    try {
        const estados = await EstadoPedido.findAll();
        return estados;
    } catch (error) {
        throw new Error(error.message);
    }
};


const updateEstadoPedidoByIdController = async (ID_EstadoPedido, estadoData) => {
    try {
        const estado = await EstadoPedido.findByPk(ID_EstadoPedido);
        if (!estado) {
            return null;
        }
        await estado.update(estadoData);
        return estado;
    } catch (error) {
        throw new Error(error.message);
    }
};


const deleteEstadoPedidoByIdController = async (ID_EstadoPedido) => {
    try {
        const estado = await EstadoPedido.findByPk(ID_EstadoPedido);
        if (!estado) {
            return null;
        }
        await estado.destroy();
        return estado;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    createEstadoPedidoController,
    getAllEstadoPedidosController,
    updateEstadoPedidoByIdController,
    deleteEstadoPedidoByIdController
};