const { Router } = require('express');
const {
    createCategoriaController,
    getAllCategoriasController,
    updateCategoriaByIdController,
    deleteCategoriaByIdController
} = require('../controllers/categoriaControllers');

const categoriaRouters = Router();

// Crear una nueva categoría
categoriaRouters.post("/", async (req, res) => {
    const { categoria, descripcion } = req.body;
    try {
        const newCategoria = await createCategoriaController({ categoria, descripcion });
        res.status(201).json(newCategoria); // Devuelve la categoría creada
    } catch (error) {
        res.status(400).json({ error: error.message }); // Manejo de errores
    }
});

// Obtener todas las categorías
categoriaRouters.get("/", async (req, res) => {
    try {
        const categorias = await getAllCategoriasController();
        res.status(200).json(categorias); // Devuelve la lista de categorías
    } catch (error) {
        res.status(400).json({ error: error.message }); // Manejo de errores
    }
});

// Actualizar una categoría por ID
categoriaRouters.put("/:categoriaId", async (req, res) => {
    const { categoriaId } = req.params;
    const categoriaData = req.body;

    try {
        const updatedCategoria = await updateCategoriaByIdController(categoriaId, categoriaData);
        if (!updatedCategoria) {
            return res.status(404).json({ error: "Categoría no encontrada" }); // Si no se encuentra la categoría
        }
        res.status(200).json(updatedCategoria); // Devuelve la categoría actualizada
    } catch (error) {
        res.status(400).json({ error: error.message }); // Manejo de errores
    }
});

// Eliminar una categoría por ID
categoriaRouters.delete("/:categoriaId", async (req, res) => {
    const { categoriaId } = req.params;

    try {
        const deletedCategoria = await deleteCategoriaByIdController(categoriaId);
        if (!deletedCategoria) {
            return res.status(404).json({ error: "Categoría no encontrada" }); // Si no se encuentra la categoría
        }
        res.status(200).json({ message: "Categoría eliminada exitosamente" }); // Devuelve mensaje de éxito
    } catch (error) {
        res.status(500).json({ error: error.message }); // Manejo de errores
    }
});

module.exports = {
    categoriaRouters
};
