import React, { useEffect, useState } from 'react';
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
  { name: 'Predeterminado', hex: '#292f36' },
];

const buttonColors = [
  { name: 'Azul', hex: '#0d6efd' },
  { name: 'Gris Oscuro', hex: '#343a40' },
  { name: 'Rojo', hex: '#dc3545' },
  { name: 'Amarillo', hex: '#ffc107' },
  { name: 'Naranja', hex: '#fd7e14' },
  { name: 'Negro', hex: '#000000' },
];

const ColorPalette = () => {
  const {
    setHeaderColor,
    setFooterColor,
    setButtonColor,
    headerColor,
    footerColor,
    buttonColor,
  } = useColorStore();

  const [selectedHeaderColors, setSelectedHeaderColors] = useState([]);
  const [selectedFooterColors, setSelectedFooterColors] = useState([]);
  const [selectedButtonColors, setSelectedButtonColors] = useState([]);

  useEffect(() => {
    const storedHeaderColors = JSON.parse(localStorage.getItem('selectedHeaderColors')) || [];
    const storedFooterColors = JSON.parse(localStorage.getItem('selectedFooterColors')) || [];
    const storedButtonColors = JSON.parse(localStorage.getItem('selectedButtonColors')) || [];
    const storedHeaderColor = localStorage.getItem('headerColor');
    const storedFooterColor = localStorage.getItem('footerColor');
    const storedButtonColor = localStorage.getItem('buttonColor');

    if (storedHeaderColor) setHeaderColor(storedHeaderColor);
    if (storedFooterColor) setFooterColor(storedFooterColor);
    if (storedButtonColor) setButtonColor(storedButtonColor);

    setSelectedHeaderColors(storedHeaderColors);
    setSelectedFooterColors(storedFooterColors);
    setSelectedButtonColors(storedButtonColors);
  }, [setHeaderColor, setFooterColor, setButtonColor]);

  const handleHeaderChange = (color) => {
    setHeaderColor(color);
    localStorage.setItem('headerColor', color);
    updateHeaderHistory(color);
  };
  
  const handleFooterChange = (color) => {
    setFooterColor(color);
    localStorage.setItem('footerColor', color);
    updateFooterHistory(color);
  };
  
  const handleButtonChange = (color) => {
    setButtonColor(color);
    localStorage.setItem('buttonColor', color);
    updateButtonHistory(color);
  };
  
  const handleCustomHeader = (e) => handleHeaderChange(e.target.value);
  const handleCustomFooter = (e) => handleFooterChange(e.target.value);
  const handleCustomButton = (e) => handleButtonChange(e.target.value);

  const updateHeaderHistory = (color) => {
    setSelectedHeaderColors((prev) => {
      const updated = [...prev];
      if (!updated.includes(color)) {
        if (updated.length >= 6) updated.shift();
        updated.push(color);
      }
      localStorage.setItem('selectedHeaderColors', JSON.stringify(updated));
      return updated;
    });
  };
  
  const updateFooterHistory = (color) => {
    setSelectedFooterColors((prev) => {
      const updated = [...prev];
      if (!updated.includes(color)) {
        if (updated.length >= 6) updated.shift();
        updated.push(color);
      }
      localStorage.setItem('selectedFooterColors', JSON.stringify(updated));
      return updated;
    });
  };
  
  const updateButtonHistory = (color) => {
    setSelectedButtonColors((prev) => {
      const updated = [...prev];
      if (!updated.includes(color)) {
        if (updated.length >= 6) updated.shift();
        updated.push(color);
      }
      localStorage.setItem('selectedButtonColors', JSON.stringify(updated));
      return updated;
    });
  };
  
  const selectedHeaderName = headerColors.find((c) => c.hex === headerColor)?.name || 'Personalizado';
  const selectedFooterName = footerColors.find((c) => c.hex === footerColor)?.name || 'Personalizado';
  const selectedButtonName = buttonColors.find((c) => c.hex === buttonColor)?.name || 'Personalizado';

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
                onClick={() => handleHeaderChange(color.hex)}
                title={`${color.name} - ${color.hex}`}
              >
                <span>{color.name}</span>
                <span>{color.hex}</span>
              </div>
            ))}
            <div
              className="color-box"
              style={{ backgroundColor: '#ffffff', color: '#000', position: 'relative' }}
            >
              <label htmlFor="customHeaderColor"><span>Personalizar</span></label>
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
                  zIndex: 10,
                }}
              />
            </div>
          </div>
          <p>Colores seleccionados</p>
          <div className="selected-color-display">
            <div className="selected-color-swatch" style={{ backgroundColor: headerColor }}></div>
            <div className="selected-color-text">
              <strong>{selectedHeaderName}</strong> ({headerColor})
            </div>
          </div>
          <div className="selected-colors-history">
            {selectedHeaderColors.map((color, idx) => (
              <div
                key={idx}
                className="selected-color-swatch"
                style={{ backgroundColor: color }}
                title={color}
                onClick={() => handleHeaderChange(color)}
              />
            ))}
          </div>
        </div>

        {/* Pie de Página */}
        <div className="palette-footer">
          <h2>Pie de Página</h2>
          <div className="colors-group">
            {footerColors.map((color, index) => (
              <div
                key={index}
                className="color-box"
                style={{ backgroundColor: color.hex }}
                onClick={() => handleFooterChange(color.hex)}
                title={`${color.name} - ${color.hex}`}
              >
                <span>{color.name}</span>
                <span>{color.hex}</span>
              </div>
            ))}
            <div
              className="color-box"
              style={{ backgroundColor: '#ffffff', color: '#000', position: 'relative' }}
            >
              <label htmlFor="customFooterColor"><span>Personalizar</span></label>
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
                  zIndex: 10,
                }}
              />
            </div>
          </div>
          <p>Colores seleccionados</p>
          <div className="selected-color-display">
            <div className="selected-color-swatch" style={{ backgroundColor: footerColor }}></div>
            <div className="selected-color-text">
              <strong>{selectedFooterName}</strong> ({footerColor})
            </div>
          </div>
          <div className="selected-colors-history">
            {selectedFooterColors.map((color, idx) => (
              <div
                key={idx}
                className="selected-color-swatch"
                style={{ backgroundColor: color }}
                title={color}
                onClick={() => handleFooterChange(color)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Paleta de Botones */}
      <div className="paletteB">
        <h2>Colores de Botones</h2>
        <div className="colors-group">
          {buttonColors.map((color, index) => (
            <div
              key={index}
              className="color-box"
              style={{ backgroundColor: color.hex }}
              title={`${color.name} - ${color.hex}`}
              onClick={() => handleButtonChange(color.hex)}
            >
              <span>{color.name}</span>
              <span>{color.hex}</span>
            </div>
          ))}
          <div
            className="color-box"
            style={{ backgroundColor: '#ffffff', color: '#000', position: 'relative' }}
          >
            <label htmlFor="customButtonColor"><span>Personalizar</span></label>
            <input
              type="color"
              id="customButtonColor"
              onChange={handleCustomButton}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: 0,
                width: '100%',
                height: '100%',
                cursor: 'pointer',
                zIndex: 10,
              }}
            />
          </div>
        </div>
        <p>Colores seleccionados</p>
        <div className="selected-color-display">
            <div className="selected-color-swatch" style={{ backgroundColor: buttonColor }}></div>
            <div className="selected-color-text">
              <strong>{selectedButtonName}</strong> ({buttonColor})
            </div>
        </div>
        <div className="selected-colors-history">
            {selectedButtonColors.map((color, idx) => (
              <div
                key={idx}
                className="selected-color-swatch"
                style={{ backgroundColor: color }}
                title={color}
                onClick={() => handleButtonChange(color)}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPalette;




