const { Router } = require("express");
const {
    createPedidoController,
    getAllPedidosController,
    updatePedidoByIdController,
    deletePedidoByIdController
} = require("../controllers/pedidoControllers");

const pedidoRouters = Router();


pedidoRouters.post("/", async (req, res) => {
    const { ID_Cliente, Fecha_Pedido, Fecha_Entrega } = req.body;
    try {
        const newPedido = await createPedidoController({ ID_Cliente, Fecha_Pedido, Fecha_Entrega });
        res.status(201).json(newPedido);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


pedidoRouters.get("/", async (req, res) => {
    try {
        const pedidos = await getAllPedidosController();
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


pedidoRouters.put("/:ID_Pedido", async (req, res) => {
    const { ID_Pedido } = req.params;
    const pedidoData = req.body;
    try {
        const updatedPedido = await updatePedidoByIdController(ID_Pedido, pedidoData);
        if (!updatedPedido) {
            return res.status(404).json({ error: "Pedido no encontrado" });
        }
        res.status(200).json(updatedPedido);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


pedidoRouters.delete("/:ID_Pedido", async (req, res) => {
    const { ID_Pedido } = req.params;
    try {
        const deletedPedido = await deletePedidoByIdController(ID_Pedido);
        if (!deletedPedido) {
            return res.status(404).json({ error: "Pedido no encontrado" });
        }
        res.status(200).json({ message: "Pedido eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = pedidoRouters;
