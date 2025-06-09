const { Router } = require('express');
const bcrypt = require('bcrypt');
const {
    createAdministradorController,
    getAllAdministradorsController,
    updateAdministradorByIdController,
    deleteAdministradorByIdController,
} = require('../controllers/administradorControllers');

const administradorRouters = Router();


// Login de administrador
administradorRouters.post("/", async (req, res) => {
    const administradorData = req.body;

    try {
        const nuevoAdministrador = await createAdministradorController(administradorData);
        res.status(201).json(nuevoAdministrador);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

administradorRouters.post('/login', async (req, res) => {
    const { Usuario, Contrasena } = req.body;

    try {
        const { getAdministradorByUsuarioController } = require('../controllers/administradorControllers');
        const admin = await getAdministradorByUsuarioController(Usuario);

        if (!admin) {
            return res.status(404).json({ mensaje: "Administrador no encontrado" });
        }

        const isPasswordValid = await bcrypt.compare(Contrasena, admin.Contrasena);
        if (!isPasswordValid) {
            return res.status(401).json({ mensaje: "Contraseña incorrecta" });
        }

        const token = Buffer.from(`${Usuario}:${Date.now()}`).toString('base64');

        return res.status(200).json({
            mensaje: "Login exitoso",
            admin: {
                ID_Administrador: admin.ID_Administrador,
                Nombre_Administrador: admin.Nombre_Administrador,
                Usuario: admin.Usuario,NumAdministrador: admin.NumAdministrador
            },
            token
        });

    } catch (error) {
        return res.status(500).json({ mensaje: "Error del servidor", error: error.message });
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