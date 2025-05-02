const { Router } = require('express');
const {
    createEmpleadoController,
    getAllEmpleadosController,
    updateEmpleadoByIdController,
    deleteEmpleadoByIdController
} = require('../controllers/EmpleadoControllers');

const empleadoRouters = Router();


empleadoRouters.post("/", async (req, res) => {
    const { ID_Empleado,Nombre_Empleado, NumCelular,URL } = req.body;
    try {
        const newEmpleado = await createEmpleadoController({ ID_Empleado,Nombre_Empleado, NumCelular,URL });
        res.status(201).json(newEmpleado);
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }
});


empleadoRouters.get("/", async (req, res) => {
    try {
        const empleados = await getAllEmpleadosController();
        res.status(200).json(empleados); 
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }
});


empleadoRouters.put("/:ID_Empleado", async (req, res) => {
    const { ID_Empleado } = req.params;
    const empleadoData = req.body;

    try {
        const updatedEmpleado = await updateEmpleadoByIdController(ID_Empleado, empleadoData);
        if (!updatedEmpleado) {
            return res.status(404).json({ error: "Empleado no encontrado" }); 
        }
        res.status(200).json(updatedEmpleado); 
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }
});


empleadoRouters.delete("/:ID_Empleado", async (req, res) => {
    const { ID_Empleado } = req.params;

    try {
        const deletedEmpleado = await deleteEmpleadoByIdController(ID_Empleado);
        if (!deletedEmpleado) {
            return res.status(404).json({ error: "Empleado no encontrado" });
        }
        res.status(200).json({ message: "Empleado eliminado exitosamente" }); 
    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
});

module.exports = {
    empleadoRouters
};