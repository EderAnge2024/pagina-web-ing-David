import React, { useState } from 'react';
import axios from 'axios';
import './FormularioImagen.css'

const FormularioImagen = () => {
  const [tipoImagen, setTipoImagen] = useState('');
  const [url, setUrl] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!tipoImagen || !url) {
      setMensaje('Por favor completa todos los campos.');
      return;
    }

    try {
      // Envía los datos al backend
      const respuesta = await axios.post('http://localhost:3001/imagen', {
        Tipo_Imagen: tipoImagen,
        URL: url,
      });

      if (respuesta.status === 201) {
        setMensaje('Imagen agregada exitosamente.');
        setTipoImagen('');
        setUrl('');
      }
    } catch (error) {
      setMensaje('Error al agregar la imagen. Intenta nuevamente.');
    }
  };

  return (
    <div>
      <h2>Agregar Imagen</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="tipoImagen">Tipo de Imagen:</label>
          <input
            type="text"
            id="tipoImagen"
            value={tipoImagen}
            onChange={(e) => setTipoImagen(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="url">URL de Imagen:</label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <button type="submit">Agregar Imagen</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default FormularioImagen;
