import React from 'react';
import { useColorStore } from '../store/colorStore';
import './paleta.css';

const headerColors = [
  { name: 'Azul', hex: '#0d6efd' },
  { name: 'Gris Oscuro', hex: '#343a40' },
  { name: 'Rojo', hex: '#dc3545' },
  { name: 'Amarillo', hex: '#ffc107' },
  { name: 'Naranja', hex: '#fd7e14' },
  { name: 'Negro', hex: '#000000' },
];

const footerColors = [
  { name: 'Azul', hex: '#0d6efd' },
  { name: 'Gris Oscuro', hex: '#343a40' },
  { name: 'Rojo', hex: '#dc3545' },
  { name: 'Amarillo', hex: '#ffc107' },
  { name: 'Naranja', hex: '#fd7e14' },
  { name: 'Negro', hex: '#000000' },
];

const ColorPalette = () => {
  const { setHeaderColor, setFooterColor, resetToDefaults } = useColorStore();

  const handleCustomHeader = (e) => setHeaderColor(e.target.value);
  const handleCustomFooter = (e) => setFooterColor(e.target.value);

  return (
    <div className="color-palette-container">
      <div className="header-footer-row">

        {/* Encabezado */}
        <div className="palette-header">
          <h2>Encabezado</h2>
          <div className="colors-group">
            {headerColors.map((color, index) => (
              <div
                key={index}
                className="color-box"
                style={{ backgroundColor: color.hex }}
                onClick={() => setHeaderColor(color.hex)}
                title={`${color.name} - ${color.hex}`}
              >
                <span>{color.name}</span>
                <span>{color.hex}</span>
              </div>
            ))}
            <div className="color-box" style={{ backgroundColor: '#ffffff', color: '#000', position: 'relative' }}>
              <label htmlFor="customHeaderColor">
                <span>Personalizar</span>
                <span>Elegir</span>
              </label>
              <input
                type="color"
                id="customHeaderColor"
                onChange={handleCustomHeader}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  opacity: 0,
                  width: '100%',
                  height: '100%',
                  cursor: 'pointer',
                  zIndex: 10
                }}
              />
            </div>
          </div>
        </div>

        {/* Pie de página */}
        <div className="palette-footer">
          <h2>Pie de página</h2>
          <div className="colors-group">
            {footerColors.map((color, index) => (
              <div
                key={index}
                className="color-box"
                style={{ backgroundColor: color.hex }}
                onClick={() => setFooterColor(color.hex)}
                title={`${color.name} - ${color.hex}`}
              >
                <span>{color.name}</span>
                <span>{color.hex}</span>
              </div>
            ))}
            <div className="color-box" style={{ backgroundColor: '#ffffff', color: '#000', position: 'relative' }}>
              <label htmlFor="customFooterColor">
                <span>Personalizar</span>
                <span>Elegir</span>
              </label>
              <input
                type="color"
                id="customFooterColor"
                onChange={handleCustomFooter}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  opacity: 0,
                  width: '100%',
                  height: '100%',
                  cursor: 'pointer',
                  zIndex: 10
                }}
              />
            </div>
          </div>
        </div>

      </div>
      
      {/* Botón para restaurar colores por defecto */}
      <div className="reset-section">
        <button 
          className="reset-button"
          onClick={resetToDefaults}
          title="Restaurar los colores originales del proyecto"
        >
          🎨 Restaurar Colores Por Defecto
        </button>
      </div>
    </div>
  );
};

export default ColorPalette;