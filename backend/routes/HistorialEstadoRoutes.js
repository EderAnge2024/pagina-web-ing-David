const { Router } = require("express");
const {
    createHistorialEstadoController,
    getAllHistorialEstadosController,
    updateHistorialEstadoByIdController,
    deleteHistorialEstadoByIdController
} = require("../controllers/HistorialEstadoControllers");

const historialEstadoRouters = Router();


historialEstadoRouters.post("/", async (req, res) => {
    const { ID_Historial, ID_EstadoPedido, ID_Pedido, Fecha } = req.body;
    try {
        const newHistorial = await createHistorialEstadoController({ ID_Historial, ID_EstadoPedido, ID_Pedido, Fecha });
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


historialEstadoRouters.put("/:ID_Historial", async (req, res) => {
    const { ID_Historial } = req.params;
    const historialData = req.body;
    try {
      const updatedHistorial = await updateHistorialEstadoByIdController(ID_Historial, historialData);
      if (!updatedHistorial) {
        return res.status(404).json({ error: "Historial no encontrada" });
      }
      res.status(200).json(updatedHistorial);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  historialEstadoRouters.delete("/:ID_Historial", async (req, res) => {
    const { ID_Historial } = req.params;
    try {
      const deletedHistorial = await deleteHistorialEstadoByIdController(ID_Historial);
      if (!deletedHistorial) {
        return res.status(404).json({ error: "Historial no encontrada" });
      }
      res.status(200).json({ message: "Historial eliminada exitosamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = {
    historialEstadoRouters
};