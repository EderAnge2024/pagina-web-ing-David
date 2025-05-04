const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Logo = sequelize.define('Logo', {
  ID_Logo: {
    type: DataTypes.INTEGER,
    primaryKey: true, 
    autoIncrement: true
  },
  Nombre_Logo: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  URL_Logo: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Logo;
