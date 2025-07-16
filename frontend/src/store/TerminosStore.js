import { useState } from 'react';

const API_URL = 'http://localhost:3001/terminos';

export function useTerminosStore() {
  const [terminos, setTerminos] = useState([]);
  const [ultimo, setUltimo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  // Obtener todos los términos
  const fetchTerminos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTerminos(data);
    } catch (err) {
      setError('Error al obtener los términos');
    } finally {
      setLoading(false);
    }
  };

  // Obtener el último término
  const fetchUltimo = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/ultimo`);
      const data = await res.json();
      setUltimo(data);
    } catch (err) {
      setError('Error al obtener el último término');
    } finally {
      setLoading(false);
    }
  };

  // Crear un nuevo término
  const createTermino = async (contenido) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenido })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje || 'Error al crear');
      await fetchTerminos();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar un término por ID
  const updateTermino = async (id, contenido) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenido })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje || 'Error al actualizar');
      await fetchTerminos();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un término por ID
  const deleteTermino = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje || 'Error al eliminar');
      await fetchTerminos();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    terminos,
    ultimo,
    loading,
    error,
    fetchTerminos,
    fetchUltimo,
    createTermino,
    updateTermino,
    deleteTermino
  };
} 