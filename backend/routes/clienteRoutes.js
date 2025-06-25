const {Router} = require('express')
const {createClienteController,getAllClienteController,updateClienteByIdController,deletedClienteByIdController}= require('../controllers/clienteControllers')
const {Cliente} = require ('../models')
const bcrypt = require('bcrypt')
const clienteRouters = Router()

clienteRouters.post("/", async (req, res) => {
  const { ID_Cliente, Nombre, Apellido, NumCelular, Email, Usuario, Contrasena} = req.body;

  try {
    const newCliente = await createClienteController({
      ID_Cliente,
      Nombre,
      Apellido,
      NumCelular,
      Email,
      Usuario,
      Contrasena
    });

    // Duración larga (10 años)
    const diezAnios = 10 * 365 * 24 * 60 * 60 * 1000;

    res.cookie('cliente_token', newCliente.token, {
      httpOnly: true,
      maxAge: diezAnios,
      sameSite: 'Strict',
      secure: false // cambiar a true si usas HTTPS
    });

    res.status(201).json(newCliente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

clienteRouters.post('/login', async (req, res) => {
    const { Usuario, Contrasena } = req.body;

    try {
        const { getClienteByUsuarioController } = require('../controllers/clienteControllers');
        const cliente = await getClienteByUsuarioController(Usuario);

        if (!cliente) {
            return res.status(404).json({ mensaje: "Cliente no encontrado" });
        }

        const isPasswordValid = await bcrypt.compare(Contrasena, cliente.Contrasena);
        if (!isPasswordValid) {
            return res.status(401).json({ mensaje: "Contraseña incorrecta" });
        }

        // ✅ Solo generar nuevo token si no existe
        let token = cliente.token;
        
        if (!token) {
            token = Buffer.from(`${cliente.ID_Cliente}:${Date.now()}`).toString('base64');
            await Cliente.update({ token }, { where: { ID_Cliente: cliente.ID_Cliente } });
        }

        // Configurar cookie segura
        res.cookie('cliente_token', token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
            sameSite: 'Lax',
            secure: process.env.NODE_ENV === 'production'
        });

        return res.status(200).json({
            mensaje: "Login exitoso",
            cliente: {
                ID_Cliente: cliente.ID_Cliente,
                Nombre: cliente.Nombre,
                Apellido: cliente.Apellido,
                NumCelular: cliente.NumCelular,
                Email: cliente.Email,
                Usuario: cliente.Usuario
            },
            token // Enviar también en la respuesta para frontend
        });

    } catch (error) {
        return res.status(500).json({ mensaje: "Error del servidor", error: error.message });
    }
});

// Endpoint para logout
clienteRouters.post('/logout', async (req, res) => {
    try {
        const token = req.cookies.cliente_token;
        
        if (token) {
            // Eliminar token de la BD
            await Cliente.update({ token: null }, { 
                where: { token } 
            });
        }

        // Limpiar cookie

        res.status(200).json({ mensaje: "Logout exitoso" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Validación mejorada
clienteRouters.get("/validar-token", async (req, res) => {
    try {
        const token = req.cookies.cliente_token;
        
        if (!token) {
            return res.status(401).json({ autenticado: false, error: "No autenticado" });
        }

        const cliente = await Cliente.findOne({ 
            where: { token },
            attributes: ['ID_Cliente', 'Nombre', 'Apellido', 'NumCelular', 'Email', 'Usuario'] // esta línea es clave
        });

        if (!cliente) {
            return res.status(401).json({ autenticado: false, error: "Token inválido" });
        }

        res.status(200).json({ 
            autenticado: true,
            cliente 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

clienteRouters.get("/",async(req,res)=>{
    try {
        const clientes = await getAllClienteController()
        res.status(200).json(clientes)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

clienteRouters.put("/:ID_Cliente", async(req,res)=>{
    const {ID_Cliente}= req.params
    const clienteData = req.body
    try {
        const updateCliente = await updateClienteByIdController(ID_Cliente, clienteData)
        if(!updateCliente){
            return res.status(404).json({error: "cliente no encontrado"})
        }
        res.status(200).json(updateCliente)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

clienteRouters.delete("/:ID_Cliente", async(req, res)=>{
    const {ID_Cliente} = req.params
    try {
       const deletedCliente = await deletedClienteByIdController(ID_Cliente)
       if(!deletedCliente){
        return res.status.apply(404).json({error:"cliente no encontrado"})
       }
       res. status(200).json({message: "Cliente eliminado exitosamente"})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

module.exports={
    clienteRouters
}