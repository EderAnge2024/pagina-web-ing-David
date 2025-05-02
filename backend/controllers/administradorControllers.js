const Administrador = require('../models/Administrador');
const bcrypt = require('bcrypt');


const createAdministradorController = async ({ ID_Administrador, Nombre_Administrador, usuario, Contrasena }) => {
    try {
        const hashedPassword = await bcrypt.hash(Contrasena, 10);
        const newAdministrador = await Administrador.create({ID_Administrador, Nombre_Administrador,usuario, Contrasena: hashedPassword});
        return newAdministrador;
    } catch (error) {
        throw new Error(error.message);
    }
};


const getAllAdministradorsController = async () => {
    try {
        const administradors = await Administrador.findAll();
        return administradors;
    } catch (error) {
        throw new Error(error.message);
    }
};


const updateAdministradorByIdController = async (ID_Administrador, administradorData) => {
    try {
        const administrador = await Administrador.findByPk(ID_Administrador);
        if (!administrador) {
            return null;
        }

        if (administradorData.Contrasena) {
            administradorData.Contrasena = await bcrypt.hash(administradorData.Contrasena, 10);
        }

        await administrador.update(administradorData);
        return administrador;
    } catch (error) {
        throw new Error(error.message);
    }
};


const deleteAdministradorByIdController = async (ID_Administrador) => {
    try {
        const administrador = await Administrador.findByPk(ID_Administrador);
        if (!administrador) {
            return null;
        }
        await administrador.destroy();
        return administrador;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    createAdministradorController,
    getAllAdministradorsController,
    updateAdministradorByIdController,
    deleteAdministradorByIdController
};