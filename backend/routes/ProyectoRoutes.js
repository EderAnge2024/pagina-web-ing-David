const { Router } = require("express");
const {
  createProyectoController,
  getAllProyectosController,
  updateProyectoByIdController,
  deleteProyectoByIdController
} = require("../controllers/ProyectoControllers");

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

proyectoRouters.put("/:ID_Proyectos", async (req, res) => {
  const { ID_Proyectos } = req.params;
  const data = req.body;
  try {
    const updatedProyecto = await updateProyectoByIdController(ID_Proyectos, data);
    if (!updatedProyecto) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }
    res.status(200).json(updatedProyecto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


proyectoRouters.delete("/:ID_Proyectos", async (req, res) => {
  const { ID_Proyectos } = req.params;
  try {
    const deletedProyecto = await deleteProyectoByIdController(ID_Proyectos);
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