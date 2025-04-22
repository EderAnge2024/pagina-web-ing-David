const EstadoPedido = require('../models/EstadoPedido');


const createEstadoPedidoController = async ({ Estado }) => {
    try {
        const newEstado = await EstadoPedido.create({ Estado });
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


const updateEstadoPedidoByIdController = async (ID_Estado, estadoData) => {
    try {
        const estado = await EstadoPedido.findByPk(ID_Estado);
        if (!estado) {
            return null;
        }
        await estado.update(estadoData);
        return estado;
    } catch (error) {
        throw new Error(error.message);
    }
};


const deleteEstadoPedidoByIdController = async (ID_Estado) => {
    try {
        const estado = await EstadoPedido.findByPk(ID_Estado);
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
