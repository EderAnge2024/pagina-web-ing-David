const HistorialEstado = require('../models/HistorialEstado');


const createHistorialEstadoController = async ({ ID_Historial, ID_EstadoPedido, ID_Pedido, Fecha }) => {
    try {
        const newHistorial = await HistorialEstado.create({
            ID_Historial,
            ID_EstadoPedido,
            ID_Pedido,
            Fecha
        });
        return newHistorial;
    } catch (error) {
        throw new Error(error.message);
    }
};


const getAllHistorialEstadosController = async () => {
    try {
        const historial = await HistorialEstado.findAll();
        return historial;
    } catch (error) {
        throw new Error(error.message);
    }
};


const updateHistorialEstadoByIdController = async ( ID_Historial,historialData) => {
    try {
        const historial = await HistorialEstado.findByPk(ID_Historial);

        if (!historial) {
            return null;
        }

        await historial.update(historialData);
        return historial;
    } catch (error) {
        throw new Error(error.message);
    }
};


const deleteHistorialEstadoByIdController = async (ID_Historial) => {
    try {
        const historial = await HistorialEstado.findByPk(ID_Historial);

        if (!historial) {
            return null;
        }

        await historial.destroy();
        return historial;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    createHistorialEstadoController,
    getAllHistorialEstadosController,
    updateHistorialEstadoByIdController,
    deleteHistorialEstadoByIdController
};