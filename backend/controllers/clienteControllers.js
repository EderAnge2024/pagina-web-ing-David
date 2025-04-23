const Cliente= require('../models/Clientes')
const createClienteController = async({ID_Cliente, Nombre, Apellido, Correo, Direccion, NumCelular, Contrasena})=>{
    try {
        const newCliente = await Cliente.create({ID_Cliente, Nombre, Apellido, Correo, Direccion, NumCelular, Contrasena})
        return newCliente
    } catch (error) {
        throw new Error (error.message)
    }
}

const getAllClienteController = async ()=>{
    try {
        const clientes = await Cliente.findAll()
        return clientes
    } catch (error) {
        throw new Error(error.message)
    }
}

const updateClienteByIdController = async (ID_Cliente,clienteData)=>{
    try {
        const cliente = await Cliente.findByPk(ID_Cliente)
        if(!cliente){
            return null
        }
        await cliente.update(clienteData)
        return cliente
    } catch (error) {
        throw new Error(error)
    }
}

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

module.exports={
    createClienteController,
    getAllClienteController,
    updateClienteByIdController,
    deletedClienteByIdController
}