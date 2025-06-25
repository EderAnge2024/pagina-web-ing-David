const Cliente= require('../models/Clientes')
const bcrypt = require('bcrypt')
const crypto = require('crypto'); 

const createClienteController = async ({ ID_Cliente, Nombre, Apellido, NumCelular, Email, Usuario, Contrasena}) => {
    try {
        const token = crypto.randomUUID(); // generar token único
        const hashedPassword = await bcrypt.hash(Contrasena, 10);
        const newCliente = await Cliente.create({
            ID_Cliente,
            Nombre,
            Apellido,
            NumCelular,
            token, // guardar token en BD,
            Email,
            Usuario,
            Contrasena: hashedPassword // encriptar
        });

        return newCliente;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getAllClienteController = async ()=>{
    try {
        const clientes = await Cliente.findAll()
        return clientes
    } catch (error) {
        throw new Error(error.message)
    }
}


const updateClienteByIdController = async (ID_Cliente, clienteData) => {
    try {
        const cliente = await Cliente.findByPk(ID_Cliente);
        if (!cliente) {
            return null;
        }

        if (clienteData.Contrasena) {
            clienteData.Contrasena = await bcrypt.hash(clienteData.Contrasena, 10);
        }

        await cliente.update(clienteData);
        return cliente;
    } catch (error) {
        throw new Error(error.message);
    }
};
const deletedClienteByIdController = async (ID_Cliente)=>{
    try {
        const cliente= await Cliente.findByPk(ID_Cliente)
        if(!cliente){
            return null
        }
        await cliente.destroy()
        return cliente
    } catch (error) {
        throw new Error(error.message)
    }
}
const getClienteByUsuarioController = async (usuario) => {
    try {
        const admin = await Cliente.findOne({ where: { Usuario: usuario } });
        return admin;
    } catch (error) {
        throw new Error(error.message);
    }
}
module.exports={
    createClienteController,
    getAllClienteController,
    updateClienteByIdController,
    deletedClienteByIdController,
    getClienteByUsuarioController
}