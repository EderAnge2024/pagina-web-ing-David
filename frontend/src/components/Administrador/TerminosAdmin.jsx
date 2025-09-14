import React, { useEffect, useState } from 'react';
import { useTerminosStore } from '../../store/TerminosStore';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TerminosAdmin = () => {
  const {
    terminos,
    loading,
    error,
    fetchTerminos,
    createTermino,
    updateTermino,
    deleteTermino
  } = useTerminosStore();

  const [formContenido, setFormContenido] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTerminos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formContenido || formContenido === '<p><br></p>') return;
    try {
      if (editId) {
        await updateTermino(editId, formContenido);
        setEditId(null);
      } else {
        await createTermino(formContenido);
      }
      setFormContenido('');
    } catch (err) {
      // error ya manejado en el store
    }
  };

  const handleEdit = (termino) => {
    setEditId(termino.id);
    setFormContenido(termino.contenido);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este registro?')) {
      await deleteTermino(id);
      if (editId === id) {
        setEditId(null);
        setFormContenido('');
      }
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setFormContenido('');
  };

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: '2rem' }}>
      <h2 style={{ marginBottom: 20 }}>Administrar Términos y Condiciones</h2>
      <div onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <ReactQuill
          value={formContenido}
          onChange={setFormContenido}
          theme="snow"
          style={{ height: 200, marginBottom: 10 }}
          placeholder="Escribe los términos y condiciones aquí..."
        />
      </div>
      <div style={{ marginBottom: 30, marginTop: 32 }}>
        <button type="button" onClick={handleSubmit} style={{ background: '#3b5bdb', color: '#fff', border: 'none', padding: '8px 22px', borderRadius: 5, fontWeight: 600, marginRight: 10 }} disabled={loading}>
          {editId ? 'Actualizar' : 'Agregar'}
        </button>
        {editId && (
          <button type="button" onClick={handleCancel} style={{ background: '#aaa', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 5, fontWeight: 600 }}>
            Cancelar
          </button>
        )}
      </div>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h3>Historial de Términos</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {terminos.map(termino => (
          <li key={termino.id} style={{ background: '#f6f8ff', marginBottom: 12, borderRadius: 6, padding: 14, position: 'relative' }}>
            <div style={{ marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: termino.contenido }} />
            <div style={{ fontSize: 13, color: '#666' }}>Actualizado: {new Date(termino.fecha_actualizacion).toLocaleString()}</div>
            <div style={{ position: 'absolute', top: 10, right: 10 }}>
              <button onClick={() => handleEdit(termino)} style={{ marginRight: 8, background: '#ffd43b', border: 'none', borderRadius: 4, padding: '4px 10px', fontWeight: 600, cursor: 'pointer' }}>Editar</button>
              <button onClick={() => handleDelete(termino.id)} style={{ background: '#fa5252', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', fontWeight: 600, cursor: 'pointer' }}>Eliminar</button>
            </div>
          </li>
        ))}
        {terminos.length === 0 && !loading && <li>No hay registros.</li>}
      </ul>
    </div>
  );
};

export default TerminosAdmin; 