const HistorialEstado = require('../models/HistorialEstado');


const createHistorialEstadoController = async ({ ID_Pedido, ID_Estado, Fecha }) => {
    try {
        const newHistorial = await HistorialEstado.create({
            ID_Pedido,
            ID_Estado,
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


const updateHistorialEstadoController = async ({ ID_Pedido, ID_Estado, Fecha }, updateData) => {
    try {
        const historial = await HistorialEstado.findOne({
            where: {
                ID_Pedido,
                ID_Estado,
                Fecha
            }
        });

        if (!historial) {
            return null;
        }

        await historial.update(updateData);
        return historial;
    } catch (error) {
        throw new Error(error.message);
    }
};


const deleteHistorialEstadoController = async ({ ID_Pedido, ID_Estado, Fecha }) => {
    try {
        const historial = await HistorialEstado.findOne({
            where: {
                ID_Pedido,
                ID_Estado,
                Fecha
            }
        });

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
    updateHistorialEstadoController,
    deleteHistorialEstadoController
};
