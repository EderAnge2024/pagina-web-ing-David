const { Router } = require("express");
const {
  createLogoController,
  getAllLogosController,
  updateLogoByIdController,
  deleteLogoByIdController
} = require("../controllers/logoControllers");

const logoRouters = Router();

// Crear logo
logoRouters.post("/", async (req, res) => {
  const { ID_Logo, Nombre_Logo, URL_Logo } = req.body;
  try {
    const newLogo = await createLogoController({ ID_Logo, Nombre_Logo, URL_Logo });
    res.status(201).json(newLogo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos los logos
logoRouters.get("/", async (req, res) => {
  try {
    const logos = await getAllLogosController();
    res.status(200).json(logos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar logo por ID
logoRouters.put("/:ID_logo", async (req, res) => {
  const { ID_logo } = req.params;
  const logoData = req.body;
  try {
    const updatedLogo = await updateLogoByIdController(ID_logo, logoData);
    if (!updatedLogo) {
      return res.status(404).json({ error: "Logo no encontrado" });
    }
    res.status(200).json(updatedLogo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar logo por ID
logoRouters.delete("/:ID_logo", async (req, res) => {
  const { ID_logo } = req.params;
  try {
    const deletedLogo = await deleteLogoByIdController(ID_logo);
    if (!deletedLogo) {
      return res.status(404).json({ error: "Logo no encontrado" });
    }
    res.status(200).json({ message: "Logo eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
  logoRouters
};
