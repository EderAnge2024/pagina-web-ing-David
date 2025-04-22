const { Router } = require("express");
const {
    createHistorialEstadoController,
    getAllHistorialEstadosController,
    updateHistorialEstadoController,
    deleteHistorialEstadoController
} = require("../controllers/HistorialEstadoControllers");

const historialEstadoRouters = Router();


historialEstadoRouters.post("/", async (req, res) => {
    const { ID_Pedido, ID_Estado, Fecha } = req.body;
    try {
        const newHistorial = await createHistorialEstadoController({ ID_Pedido, ID_Estado, Fecha });
        res.status(201).json(newHistorial);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


historialEstadoRouters.get("/", async (req, res) => {
    try {
        const historial = await getAllHistorialEstadosController();
        res.status(200).json(historial);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


historialEstadoRouters.put("/:ID_Pedido/:ID_Estado/:Fecha", async (req, res) => {
    const { ID_Pedido, ID_Estado, Fecha } = req.params;
    const updateData = req.body;
    try {
        const updatedHistorial = await updateHistorialEstadoController({ ID_Pedido, ID_Estado, Fecha }, updateData);
        if (!updatedHistorial) {
            return res.status(404).json({ error: "Historial no encontrado" });
        }
        res.status(200).json(updatedHistorial);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


historialEstadoRouters.delete("/:ID_Pedido/:ID_Estado/:Fecha", async (req, res) => {
    const { ID_Pedido, ID_Estado, Fecha } = req.params;
    try {
        const deletedHistorial = await deleteHistorialEstadoController({ ID_Pedido, ID_Estado, Fecha });
        if (!deletedHistorial) {
            return res.status(404).json({ error: "Historial no encontrado" });
        }
        res.status(200).json({ message: "Historial eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = historialEstadoRouters;
