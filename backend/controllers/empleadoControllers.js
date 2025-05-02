const Empleado = require('../models/Empleado');
const bcrypt = require('bcrypt');


const createEmpleadoController = async ({ ID_Empleado,Nombre_Empleado, NumCelular,URL }) => {
    try {
        const newEmpleado = await Empleado.create({ID_Empleado,Nombre_Empleado,NumCelular,URL});
        return newEmpleado;
    } catch (error) {
        throw new Error(error.message);
    }
};


const getAllEmpleadosController = async () => {
    try {
        const empleados = await Empleado.findAll();
        return empleados;
    } catch (error) {
        throw new Error(error.message);
    }
};


const updateEmpleadoByIdController = async (ID_Empleado, empleadoData) => {
    try {
        const empleado = await Empleado.findByPk(ID_Empleado);
        if (!empleado) {
            return null;
        }
       await empleado.update(empleadoData);
        return empleado;
    } catch (error) {
        throw new Error(error.message);
    }
};


const deleteEmpleadoByIdController = async (ID_Empleado) => {
    try {
        const empleado = await Empleado.findByPk(ID_Empleado);
        if (!empleado) {
            return null;
        }
        await empleado.destroy();
        return empleado;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    createEmpleadoController,
    getAllEmpleadosController,
    updateEmpleadoByIdController,
    deleteEmpleadoByIdController
};