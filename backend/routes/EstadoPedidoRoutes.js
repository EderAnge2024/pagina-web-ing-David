const { Router } = require('express');
const {
    createEstadoPedidoController,
    getAllEstadoPedidosController,
    updateEstadoPedidoByIdController,
    deleteEstadoPedidoByIdController
} = require('../controllers/estadoPedidoControllers');

const estadoPedidoRouters = Router();


estadoPedidoRouters.post("/", async (req, res) => {
    const { Estado } = req.body;
    try {
        const newEstado = await createEstadoPedidoController({ Estado });
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


estadoPedidoRouters.put("/:ID_Estado", async (req, res) => {
    const { ID_Estado } = req.params;
    const estadoData = req.body;

    try {
        const updatedEstado = await updateEstadoPedidoByIdController(ID_Estado, estadoData);
        if (!updatedEstado) {
            return res.status(404).json({ error: "Estado de pedido no encontrado" });
        }
        res.status(200).json(updatedEstado); 
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }
});


estadoPedidoRouters.delete("/:ID_Estado", async (req, res) => {
    const { ID_Estado } = req.params;

    try {
        const deletedEstado = await deleteEstadoPedidoByIdController(ID_Estado);
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

