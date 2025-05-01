const { Router } = require('express');
const {
    createEstadoPedidoController,
    getAllEstadoPedidosController,
    updateEstadoPedidoByIdController,
    deleteEstadoPedidoByIdController
} = require('../controllers/EstadoPedidoControllers');

const estadoPedidoRouters = Router();


estadoPedidoRouters.post("/", async (req, res) => {
    const { ID_EstadoPedido,Estado } = req.body;
    try {
        const newEstado = await createEstadoPedidoController({ ID_EstadoPedido,Estado });
        res.status(201).json(newEstado);
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }
});


estadoPedidoRouters.get("/", async (req, res) => {
    try {
        const estados = await getAllEstadoPedidosController();
        res.status(200).json(estados); 
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


estadoPedidoRouters.put("/:ID_EstadoPedido", async (req, res) => {
    const { ID_EstadoPedido } = req.params;
    const estadoData = req.body;

    try {
        const updatedEstado = await updateEstadoPedidoByIdController(ID_EstadoPedido, estadoData);
        if (!updatedEstado) {
            return res.status(404).json({ error: "Estado de pedido no encontrado" });
        }
        res.status(200).json(updatedEstado); 
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }
});


estadoPedidoRouters.delete("/:ID_EstadoPedido", async (req, res) => {
    const { ID_EstadoPedido } = req.params;

    try {
        const deletedEstado = await deleteEstadoPedidoByIdController(ID_EstadoPedido);
        if (!deletedEstado) {
            return res.status(404).json({ error: "Estado de pedido no encontrado" }); 
        }
        res.status(200).json({ message: "Estado de pedido eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: error.message }); // Manejo de errores
    }
});

module.exports = {
    estadoPedidoRouters
};