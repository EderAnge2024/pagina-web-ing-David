const { Router } = require("express");
const {
  createImagenController,
  getAllImagensController,
  updateImagenByIdController,
  deleteImagenByIdController
} = require("../controllers/ImagenControllers");

const imagenRouters = Router();


imagenRouters.post("/", async (req, res) => {
  const { ID_Imagen, Tipo_Imagen, URL } = req.body;
  try {
    const newImagen = await createImagenController({ ID_Imagen, Tipo_Imagen, URL });
    res.status(201).json(newImagen);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


imagenRouters.get("/", async (req, res) => {
  try {
    const imagens = await getAllImagensController();
    res.status(200).json(imagens);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

imagenRouters.put("/:ID_Imagen", async (req, res) => {
  const { ID_Imagen } = req.params;
  const imagenData = req.body;
  try {
    const updatedImagen = await updateImagenByIdController(ID_Imagen, imagenData);
    if (!updatedImagen) {
      return res.status(404).json({ error: "Imagen no encontrada" });
    }
    res.status(200).json(updatedImagen);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


imagenRouters.delete("/:ID_Imagen", async (req, res) => {
  const { ID_Imagen } = req.params;
  try {
    const deletedImagen = await deleteImagenByIdController(ID_Imagen);
    if (!deletedImagen) {
      return res.status(404).json({ error: "Imagen no encontrada" });
    }
    res.status(200).json({ message: "Imagen eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
    imagenRouters 
};
