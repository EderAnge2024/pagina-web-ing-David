const TerminosCondiciones = require('../models/TerminosCondiciones');

// Listar todos los términos y condiciones
exports.getAll = async (req, res) => {
  try {
    const terminos = await TerminosCondiciones.findAll({ order: [['fecha_actualizacion', 'DESC']] });
    res.json(terminos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los términos.', error });
  }
};

// Obtener un término por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const terminos = await TerminosCondiciones.findByPk(id);
    if (!terminos) {
      return res.status(404).json({ mensaje: 'No se encontró el registro.' });
    }
    res.json(terminos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el registro.', error });
  }
};

// Crear nuevos términos y condiciones
exports.create = async (req, res) => {
  try {
    const { contenido } = req.body;
    if (!contenido) {
      return res.status(400).json({ mensaje: 'El contenido es requerido.' });
    }
    const terminos = await TerminosCondiciones.create({ contenido });
    res.status(201).json({ mensaje: 'Términos creados correctamente.', terminos });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear los términos.', error });
  }
};

// Actualizar términos por ID
exports.updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const { contenido } = req.body;
    const terminos = await TerminosCondiciones.findByPk(id);
    if (!terminos) {
      return res.status(404).json({ mensaje: 'No se encontró el registro.' });
    }
    terminos.contenido = contenido || terminos.contenido;
    terminos.fecha_actualizacion = new Date();
    await terminos.save();
    res.json({ mensaje: 'Términos actualizados correctamente.', terminos });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar los términos.', error });
  }
};

// Eliminar términos por ID
exports.deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const terminos = await TerminosCondiciones.findByPk(id);
    if (!terminos) {
      return res.status(404).json({ mensaje: 'No se encontró el registro.' });
    }
    await terminos.destroy();
    res.json({ mensaje: 'Términos eliminados correctamente.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar los términos.', error });
  }
};

// Obtener el último registro (para frontend)
exports.getTerminos = async (req, res) => {
  try {
    const terminos = await TerminosCondiciones.findOne({ order: [['fecha_actualizacion', 'DESC']] });
    if (!terminos) {
      return res.status(404).json({ mensaje: 'No se encontraron términos y condiciones.' });
    }
    res.json(terminos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los términos.', error });
  }
};

// Actualizar el último registro (para compatibilidad)
exports.updateTerminos = async (req, res) => {
  try {
    const { contenido } = req.body;
    if (!contenido) {
      return res.status(400).json({ mensaje: 'El contenido es requerido.' });
    }
    let terminos = await TerminosCondiciones.findOne({ order: [['fecha_actualizacion', 'DESC']] });
    if (terminos) {
      terminos.contenido = contenido;
      terminos.fecha_actualizacion = new Date();
      await terminos.save();
    } else {
      terminos = await TerminosCondiciones.create({ contenido });
    }
    res.json({ mensaje: 'Términos actualizados correctamente.', terminos });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar los términos.', error });
  }
}; 