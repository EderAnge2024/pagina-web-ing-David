const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const TerminosCondiciones = sequelize.define('TerminosCondiciones', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fecha_actualizacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'terminos_condiciones',
  timestamps: false,
});

module.exports = TerminosCondiciones; 