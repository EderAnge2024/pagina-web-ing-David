const { Router } = require('express');
const TerminosCondicionesController = require('../controllers/TerminosCondicionesControllers');

const terminosRouters = Router();

// CRUD completo
terminosRouters.get('/', TerminosCondicionesController.getAll); // Listar todos
terminosRouters.get('/ultimo', TerminosCondicionesController.getTerminos); // Último para frontend
terminosRouters.get('/:id', TerminosCondicionesController.getById); // Obtener uno
terminosRouters.post('/', TerminosCondicionesController.create); // Crear
terminosRouters.put('/:id', TerminosCondicionesController.updateById); // Actualizar uno
terminosRouters.delete('/:id', TerminosCondicionesController.deleteById); // Eliminar uno

// Compatibilidad: actualizar el último
terminosRouters.put('/', TerminosCondicionesController.updateTerminos);

module.exports = {
  terminosRouters
}; 