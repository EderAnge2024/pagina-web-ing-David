import React, { useState } from 'react';
import axios from 'axios';
 // También cambié el nombre del archivo CSS

const FormularioLogo = () => {
  const [tipoLogo, setTipoLogo] = useState('');
  const [url, setUrl] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!tipoLogo || !url) {
      setMensaje('Por favor completa todos los campos.');
      return;
    }

    try {
      // Envía los datos al backend con los nombres correctos
      const respuesta = await axios.post('http://localhost:3001/logo', {
        Nombre_Logo: tipoLogo,  // Cambié de Tipo_Logo a Nombre_Logo
        URL_Logo: url,          // Cambié de URL a URL_Logo
      });

      if (respuesta.status === 201) {
        setMensaje('Logo agregado exitosamente.');
        setTipoLogo('');
        setUrl('');
      }
    } catch (error) {
      setMensaje('Error al agregar el logo. Intenta nuevamente.');
    }
};


  return (
    <div>
      <h2>Agregar Logo</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="tipoLogo">Tipo de Logo:</label>
          <input
            type="text"
            id="tipoLogo"
            value={tipoLogo}
            onChange={(e) => setTipoLogo(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="url">URL del Logo:</label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <button type="submit">Agregar Logo</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default FormularioLogo;
