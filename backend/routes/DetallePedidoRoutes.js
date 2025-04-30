const { Router } = require('express');
const {
    createPedidoDetalleController,
    getAllPedidoDetallesController,
    updatePedidoDetalleByIdController,
    deletePedidoDetalleByIdController
} = require('../controllers/DetallePedidoControllers');

const pedidoDetalleRouters = Router();


pedidoDetalleRouters.post("/", async (req, res) => {
    const { ID_Pedido, ID_Producto, Cantidad, Precio_Unitario, Descuento, Subtotal } = req.body;
    try {
        const newDetalle = await createPedidoDetalleController({ ID_Pedido, ID_Producto, Cantidad, Precio_Unitario, Descuento, Subtotal });
        res.status(201).json(newDetalle);
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }
});


pedidoDetalleRouters.get("/", async (req, res) => {
    try {
        const detalles = await getAllPedidoDetallesController();
        res.status(200).json(detalles); 
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }
});


pedidoDetalleRouters.put("/:ID_Detalle", async (req, res) => {
    const { ID_Detalle } = req.params;
    const detalleData = req.body;

    try {
        const updatedDetalle = await updatePedidoDetalleByIdController(ID_Detalle, detalleData);
        if (!updatedDetalle) {
            return res.status(404).json({ error: "Detalle de pedido no encontrado" }); 
        }
        res.status(200).json(updatedDetalle); 
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }
});


pedidoDetalleRouters.delete("/:ID_Detalle", async (req, res) => {
    const { ID_Detalle } = req.params;

    try {
        const deletedDetalle = await deletePedidoDetalleByIdController(ID_Detalle);
        if (!deletedDetalle) {
            return res.status(404).json({ error: "Detalle de pedido no encontrado" }); // Si no se encuentra el detalle
        }
        res.status(200).json({ message: "Detalle de pedido eliminado exitosamente" }); // Devuelve mensaje de éxito
    } catch (error) {
        res.status(500).json({ error: error.message }); // Manejo de errores
    }
});

module.exports = {
    pedidoDetalleRouters
};