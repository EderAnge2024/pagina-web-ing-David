const { Router } = require("express");
const {
  createProyectoController,
  getAllProyectosController,
  getProyectoByIdController,
  updateProyectoByIdController,
  deleteProyectoByIdController
} = require("../controllers/proyectoControllers");

const proyectoRouters = Router();


proyectoRouters.post("/", async (req, res) => {
  const { ID_Empleados, Lugar, URL } = req.body;
  try {
    const newProyecto = await createProyectoController({ ID_Empleados, Lugar, URL });
    res.status(201).json(newProyecto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


proyectoRouters.get("/", async (req, res) => {
  try {
    const proyectos = await getAllProyectosController();
    res.status(200).json(proyectos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


proyectoRouters.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const proyecto = await getProyectoByIdController(id);
    if (!proyecto) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }
    res.status(200).json(proyecto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


proyectoRouters.put("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updatedProyecto = await updateProyectoByIdController(id, data);
    if (!updatedProyecto) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }
    res.status(200).json(updatedProyecto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


proyectoRouters.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProyecto = await deleteProyectoByIdController(id);
    if (!deletedProyecto) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }
    res.status(200).json({ message: "Proyecto eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
  proyectoRouters
};
