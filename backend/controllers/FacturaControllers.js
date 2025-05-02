const Factura = require('../models/Factura');


const createFacturaController = async ({ ID_Pedido, ID_Cliente, Fecha, Monto_Total }) => {
    try {
        const newFactura = await Factura.create({ID_Pedido,ID_Cliente,Fecha,Monto_Total});
        return newFactura;
    } catch (error) {
        throw new Error(error.message);
    }
};


const getAllFacturasController = async () => {
    try {
        const facturas = await Factura.findAll();
        return facturas;
    } catch (error) {
        throw new Error(error.message);
    }
};


const updateFacturaByIdController = async (ID_Factura, facturaData) => {
    try {
        const factura = await Factura.findByPk(ID_Factura);
        if (!factura) {
            return null;
        }
        await factura.update(facturaData);
        return factura;
    } catch (error) {
        throw new Error(error.message);
    }
};


const deleteFacturaByIdController = async (ID_Factura) => {
    try {
        const factura = await Factura.findByPk(ID_Factura);
        if (!factura) {
            return null;
        }
        await factura.destroy();
        return factura;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    createFacturaController,
    getAllFacturasController,
    updateFacturaByIdController,
    deleteFacturaByIdController
};