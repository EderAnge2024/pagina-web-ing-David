const Logo = require('../models/logo');

// Crear un nuevo logo
const createLogoController = async ({ Nombre_Logo, URL_Logo }) => {
    try {
        const newLogo = await Logo.create({ Nombre_Logo, URL_Logo });
        return newLogo;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Obtener todos los logos
const getAllLogosController = async () => {
    try {
        const logos = await Logo.findAll();
        return logos;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Actualizar un logo por ID
const updateLogoByIdController = async (ID_Logo, logoData) => {
    try {
        const updateLogo = await Logo.findByPk(ID_Logo);
        if (!updateLogo) {
            return null;
        }
        await updateLogo.update(logoData);
        return updateLogo;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Eliminar un logo por ID
const deleteLogoByIdController = async (ID_Logo) => {
    try {
        const deleteLogo = await Logo.findByPk(ID_Logo);
        if (!deleteLogo) {
            return null;
        }
        await deleteLogo.destroy();
        return deleteLogo;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    createLogoController,
    getAllLogosController,
    updateLogoByIdController,
    deleteLogoByIdController
};
