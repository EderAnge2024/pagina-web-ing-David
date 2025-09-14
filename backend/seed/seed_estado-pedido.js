const EstadoPedido = require('../models/EstadoPedido'); // Ajusta según tu estructura

async function seedEstadoPedido() {
  try {
    const estados = ['en proceso', 'completado', 'cancelado', 'enviado'];

    for (const estado of estados) {
      await EstadoPedido.findOrCreate({
        where: { Estado: estado }
      });
    }

    console.log('Seed de EstadoPedido completado.');
  } catch (error) {
    console.error('Error al hacer el seed:', error);
  }
}

module.exports = seedEstadoPedido;
