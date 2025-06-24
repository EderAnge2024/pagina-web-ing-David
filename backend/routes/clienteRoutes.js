const {Router} = require('express')
const {createClienteController,getAllClienteController,updateClienteByIdController,deletedClienteByIdController}= require('../controllers/clienteControllers')
const {Cliente} = require ('../models')
const clienteRouters = Router()

clienteRouters.post("/", async (req, res) => {
  const { ID_Cliente, Nombre, Apellido, NumCelular } = req.body;

  try {
    const newCliente = await createClienteController({
      ID_Cliente,
      Nombre,
      Apellido,
      NumCelular
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

clienteRouters.get("/",async(req,res)=>{
    try {
        const clientes = await getAllClienteController()
        res.status(200).json(clientes)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

clienteRouters.get("/validar-token", async (req, res) => {
  const token = req.cookies.cliente_token;

  if (!token) return res.status(401).json({ error: "No autenticado" });

  const cliente = await Cliente.findOne({ where: { token } });

  if (!cliente) return res.status(401).json({ error: "Token inválido" });

  res.status(200).json({ mensaje: "Autenticado", cliente });
});


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