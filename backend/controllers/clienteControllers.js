const Cliente= require('../models/Clientes')
const createClienteController = async({clienteId, nombre, apellido, telefono, direccion})=>{
    try {
        const newCliente = await Cliente.create({clienteId,nombre,apellido,telefono,direccion})
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

const updateClienteByIdController = async (clienteId,clienteData)=>{
    try {
        const cliente = await Cliente.findByPk(clienteId)
        if(!cliente){
            return null
        }
        await cliente.update(clienteData)
        return cliente
    } catch (error) {
        throw new Error(error)
    }
}

const deletedClienteByIdController = async (clienteId)=>{
    try {
        const cliente= await Cliente.findByPk(clienteId)
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