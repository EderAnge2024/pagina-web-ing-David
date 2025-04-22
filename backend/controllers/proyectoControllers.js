const Proyecto = require('../models/Proyecto');


const createProyectoController = async ({ ID_Empleados, Lugar, URL }) => {
    try {
        const newProyecto = await Proyecto.create({
            ID_Empleados,
            Lugar,
            URL
        });
        return newProyecto;
    } catch (error) {
        throw new Error(error.message);
    }
};


const getAllProyectosController = async () => {
    try {
        const proyectos = await Proyecto.findAll();
        return proyectos;
    } catch (error) {
        throw new Error(error.message);
    }
};


const getProyectoByIdController = async (ID_Proyectos) => {
    try {
        const proyecto = await Proyecto.findByPk(ID_Proyectos);
        return proyecto;
    } catch (error) {
        throw new Error(error.message);
    }
};


const updateProyectoByIdController = async (ID_Proyectos, updateData) => {
    try {
        const proyecto = await Proyecto.findByPk(ID_Proyectos);
        if (!proyecto) {
            return null;
        }
        await proyecto.update(updateData);
        return proyecto;
    } catch (error) {
        throw new Error(error.message);
    }
};


const deleteProyectoByIdController = async (ID_Proyectos) => {
    try {
        const proyecto = await Proyecto.findByPk(ID_Proyectos);
        if (!proyecto) {
            return null;
        }
        await proyecto.destroy();
        return proyecto;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    createProyectoController,
    getAllProyectosController,
    getProyectoByIdController,
    updateProyectoByIdController,
    deleteProyectoByIdController
};
