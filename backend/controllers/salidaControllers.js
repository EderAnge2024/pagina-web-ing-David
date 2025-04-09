const Salida= require('../models/Salidas')
const createSalidaController = async({salidaId, productoId, clienteId,fechaSalida,cantidad,precioVenta,totalPrecio})=>{
    try {
        const newSalida = await Salida.create({salidaId, productoId, clienteId,fechaSalida,cantidad,precioVenta,totalPrecio})
        return newSalida
    } catch (error) {
        throw new Error (error.message)
    }
}

const getAllSalidaController = async ()=>{
    try {
        const salidas = await Salida.findAll()
        return salidas
    } catch (error) {
        throw new Error(error.message)
    }
}

const updateSalidaByIdController = async (salidaId,salidaData)=>{
    try {
        const salida = await Salida.findByPk(salidaId)
        if(!salida){
            return null
        }
        await salida.update(salidaData)
        return salida
    } catch (error) {
        throw new Error(error)
    }
}

const deletedSalidaByIdController = async (salidaId)=>{
    try {
        const salida= await Salida.findByPk(salidaId)
        if(!salida){
            return null
        }
        await salida.destroy()
        return salida
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports={
    createSalidaController,
    getAllSalidaController,
    updateSalidaByIdController,
    deletedSalidaByIdController
}