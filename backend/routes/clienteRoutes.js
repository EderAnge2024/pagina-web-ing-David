const { Router } = require("express");
const {
  createClienteController,
  getAllClienteController,
  updateClienteByIdController,
  deleteClienteByIdController,
  loginClienteController
} = require("../controllers/clienteControllers");

const clienteRouters = Router();

clienteRouters.post("/", async (req, res) => {
  const { nombre, apellidos, correo, telefono, direccion, contraseña } = req.body;
  try {
    const newCliente = await createClienteController({
      nombre,
      apellidos,
      correo,
      telefono,
      direccion,
      contraseña
    });
    res.status(201).json(newCliente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

clienteRouters.get("/", async (req, res) => {
  try {
    const clientes = await getAllClienteController();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

clienteRouters.put("/:clienteId", async (req, res) => {
  const { clienteId } = req.params;
  const clienteData = req.body;
  try {
    const updateCliente = await updateClienteByIdController(clienteId, clienteData);
    if (!updateCliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.status(200).json(updateCliente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

clienteRouters.delete("/:clienteId", async (req, res) => {
  const { clienteId } = req.params;
  try {
    const deletedCliente = await deleteClienteByIdController(clienteId);
    if (!deletedCliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.status(200).json({ message: "Cliente eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar sesión
clienteRouters.post("/login", async (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
      return res.status(400).json({ error: "Correo y contraseña son obligatorios" });
  }

  try {
    const loginResponse = await loginClienteController({ correo, contraseña });
    res.status(200).json(loginResponse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = clienteRouters;
