const { Router } = require("express");
const {
  createInformacionController,
  getAllInformacionsController,
  updateInformacionByIdController,
  deleteInformacionByIdController
} = require("../controllers/informacionControllers");

const informacionRouters = Router();


informacionRouters.post("/", async (req, res) => {
  const { ID_Informacion, Tipo_Informacion, Dato } = req.body;
  try {
    const newInformacion = await createInformacionController({ ID_Informacion, Tipo_Informacion, Dato });
    res.status(201).json(newInformacion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


informacionRouters.get("/", async (req, res) => {
  try {
    const informacions = await getAllInformacionsController();
    res.status(200).json(informacions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

informacionRouters.put("/:ID_Informacion", async (req, res) => {
  const { ID_Informacion } = req.params;
  const informacionData = req.body;
  try {
    const updatedInformacion = await updateInformacionByIdController(ID_Informacion, informacionData);
    if (!updatedInformacion) {
      return res.status(404).json({ error: "Informacion no encontrada" });
    }
    res.status(200).json(updatedInformacion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


informacionRouters.delete("/:ID_Informacion", async (req, res) => {
  const { ID_Informacion } = req.params;
  try {
    const deletedInformacion = await deleteInformacionByIdController(ID_Informacion);
    if (!deletedInformacion) {
      return res.status(404).json({ error: "Informacion no encontrada" });
    }
    res.status(200).json({ message: "Informacion eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
    informacionRouters 
};
