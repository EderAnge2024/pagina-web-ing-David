const Cliente = require('../models/Clientes');
const bcrypt = require('bcrypt');

const createClienteController = async ({ Nombre, Apellidos, Correo, Direccion, NumCelular, Contraseña }) => {
    const hashedPassword = await bcrypt.hash(Contraseña, 10);
    try {
        const newCliente = await Cliente.create({
            Nombre,
            Apellidos,
            Correo,
            Direccion,
            NumCelular,
            Contraseña: hashedPassword
        });
        return newCliente;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getAllClienteController = async () => {
    try {
        const clientes = await Cliente.findAll();
        return clientes;
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateClienteByIdController = async (clienteId, clienteData) => {
    try {
        const cliente = await Cliente.findByPk(clienteId);
        if (!cliente) {
            return null;
        }
        await cliente.update(clienteData);
        return cliente;
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteClienteByIdController = async (clienteId) => {
    try {
        const cliente = await Cliente.findByPk(clienteId);
        if (!cliente) {
            return null;
        }
        await cliente.destroy();
        return cliente;
    } catch (error) {
        throw new Error(error.message);
    }
};


const loginClienteController = async ({ correo, contraseña }) => {
    try {
        // Buscar al cliente por correo
        const cliente = await Cliente.findOne({ where: { Correo: correo } });
        if (!cliente) {
            throw new Error('Correo o contraseña incorrectos');
        }

        // Comparar la contraseña proporcionada con la almacenada
        const passwordMatch = await bcrypt.compare(contraseña, cliente.Contraseña);
        if (!passwordMatch) {
            throw new Error('Correo o contraseña incorrectos');
        }

        // Si la contraseña es correcta, devolver los datos del cliente (sin la contraseña)
        const { Contraseña, ...clienteSinContraseña } = cliente.toJSON();
        return clienteSinContraseña;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    createClienteController,
    getAllClienteController,
    updateClienteByIdController,
    deleteClienteByIdController,
    loginClienteController
};
