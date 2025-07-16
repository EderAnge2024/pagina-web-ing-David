const { Router } = require('express');
const bcrypt = require('bcrypt');
const {
    createAdministradorController,
    getAllAdministradorsController,
    updateAdministradorByIdController,
    deleteAdministradorByIdController,
    generarCodigoRecuperacion,
    verificarCodigoRecuperacion,
    solicitarCodigoRecuperacionEmail,
    verificarCodigoRecuperacionEmail
} = require('../controllers/administradorControllers');
// const { sendWhatsAppMessage, initWhatsApp } = require('../whatsappService');

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

// Endpoint para solicitar código de recuperación
administradorRouters.post('/recuperar', async (req, res) => {
    const { usuario } = req.body;
    try {
        // Inicializa WhatsApp si es necesario
        initWhatsApp();
        const { codigo, numero } = await generarCodigoRecuperacion(usuario);
        await sendWhatsAppMessage(numero, `Tu código de recuperación es: ${codigo}`);
        res.status(200).json({ mensaje: 'Código enviado por WhatsApp' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Endpoint para verificar código y cambiar contraseña
administradorRouters.post('/recuperar/verificar', async (req, res) => {
    const { usuario, codigo, nuevaContrasena } = req.body;
    try {
        await verificarCodigoRecuperacion(usuario, codigo, nuevaContrasena);
        res.status(200).json({ mensaje: 'Contraseña actualizada correctamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Endpoint para solicitar código de recuperación por email
administradorRouters.post('/recuperar-email', async (req, res) => {
    const { email } = req.body;
    try {
        await solicitarCodigoRecuperacionEmail(email);
        res.status(200).json({ mensaje: 'Código enviado por correo electrónico' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Endpoint para verificar código y cambiar contraseña por email
administradorRouters.post('/recuperar-email/verificar', async (req, res) => {
    const { email, codigo, nuevaContrasena } = req.body;
    try {
        await verificarCodigoRecuperacionEmail(email, codigo, nuevaContrasena);
        res.status(200).json({ mensaje: 'Contraseña actualizada correctamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = {
    administradorRouters
};