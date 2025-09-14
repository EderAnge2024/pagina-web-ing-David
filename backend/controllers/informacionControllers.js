const Informacion = require('../models/Informacion');


const createInformacionController = async ({ ID_Informacion, Tipo_Informacion, Dato}) => {
    try {
        const newInformacion = await Informacion.create({ ID_Informacion, Tipo_Informacion, Dato });
        return newInformacion;
    } catch (error) {
        throw new Error(error.message);
    }
};


const getAllInformacionsController = async () => {
    try {
        const informacions = await Informacion.findAll();
        return informacions;
    } catch (error) {
        throw new Error(error.message);
    }
};


const updateInformacionByIdController = async (ID_Informacion, informacionData) => {
    try {
        const informacion = await Informacion.findByPk(ID_Informacion);
        if (!informacion) {
            return null;
        }
        await informacion.update(informacionData);
        return informacion;
    } catch (error) {
        throw new Error(error.message);
    }
};


const deleteInformacionByIdController = async (ID_Informacion) => {
    try {
        const informacion = await Informacion.findByPk(ID_Informacion);
        if (!informacion) {
            return null;
        }
        await informacion.destroy();
        return informacion;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    createInformacionController,
    getAllInformacionsController,
    updateInformacionByIdController,
    deleteInformacionByIdController
};