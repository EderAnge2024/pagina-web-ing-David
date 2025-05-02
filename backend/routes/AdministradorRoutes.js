const { Router } = require('express');
const {
    createAdministradorController,
    getAllAdministradorsController,
    updateAdministradorByIdController,
    deleteAdministradorByIdController
} = require('../controllers/administradorControllers');

const administradorRouters = Router();


administradorRouters.post("/", async (req, res) => {
    const {  ID_Administrador, Nombre_Administrador, usuario, Contrasena } = req.body;
    try {
        const newAdministrador = await createAdministradorController({  ID_Administrador, Nombre_Administrador, usuario, Contrasena });
        res.status(201).json(newAdministrador);
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }
});


administradorRouters.get("/", async (req, res) => {
    try {
        const administradors = await getAllAdministradorsController();
        res.status(200).json(administradors); 
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }
});


administradorRouters.put("/:ID_Administrador", async (req, res) => {
    const { ID_Administrador } = req.params;
    const administradorData = req.body;

    try {
        const updatedAdministrador = await updateAdministradorByIdController(ID_Administrador, administradorData);
        if (!updatedAdministrador) {
            return res.status(404).json({ error: "Administrador no encontrado" }); 
        }
        res.status(200).json(updatedAdministrador); 
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }
});


administradorRouters.delete("/:ID_Administrador", async (req, res) => {
    const { ID_Administrador } = req.params;

    try {
        const deletedAdministrador = await deleteAdministradorByIdController(ID_Administrador);
        if (!deletedAdministrador) {
            return res.status(404).json({ error: "Administrador no encontrado" });
        }
        res.status(200).json({ message: "Administrador eliminado exitosamente" }); 
    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
});

module.exports = {
    administradorRouters
};