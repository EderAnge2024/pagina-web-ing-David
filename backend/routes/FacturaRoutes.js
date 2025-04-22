const { Router } = require("express");
const {
  createFacturaController,
  getAllFacturasController,
  updateFacturaByIdController,
  deleteFacturaByIdController
} = require("../controllers/FacturaControllers");

const facturaRouters = Router();


facturaRouters.post("/", async (req, res) => {
  const { ID_Pedido, ID_Cliente, Fecha, Monto_Total } = req.body;
  try {
    const newFactura = await createFacturaController({ ID_Pedido, ID_Cliente, Fecha, Monto_Total });
    res.status(201).json(newFactura);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


facturaRouters.get("/", async (req, res) => {
  try {
    const facturas = await getAllFacturasController();
    res.status(200).json(facturas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


facturaRouters.get("/:ID_Factura", async (req, res) => {
  const { ID_Factura } = req.params;
  try {
    const factura = await getAllFacturasController(ID_Factura);
    if (!factura) {
      return res.status(404).json({ error: "Factura no encontrada" });
    }
    res.status(200).json(factura);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


facturaRouters.put("/:ID_Factura", async (req, res) => {
  const { ID_Factura } = req.params;
  const facturaData = req.body;
  try {
    const updatedFactura = await updateFacturaByIdController(ID_Factura, facturaData);
    if (!updatedFactura) {
      return res.status(404).json({ error: "Factura no encontrada" });
    }
    res.status(200).json(updatedFactura);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


facturaRouters.delete("/:ID_Factura", async (req, res) => {
  const { ID_Factura } = req.params;
  try {
    const deletedFactura = await deleteFacturaByIdController(ID_Factura);
    if (!deletedFactura) {
      return res.status(404).json({ error: "Factura no encontrada" });
    }
    res.status(200).json({ message: "Factura eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
    facturaRouters 
};
