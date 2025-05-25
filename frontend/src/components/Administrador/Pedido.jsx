import { useEffect, useState } from 'react';
import usePedidoStore from '../../store/PedidoStore';
import './Pedido.css'; // Asegúrate de enlazar tu CSS aquí si está en un archivo externo

const Pedido = () => {
  const { addPedido, fetchPedido, pedidos, deletePedido, updatePedido } = usePedidoStore();
  const [editingPedido, setEditingPedido] = useState(null);
  const [formData, setFormData] = useState({ ID_Cliente: "", Fecha_Pedido: "", Fecha_Entrega: "" });

  useEffect(() => {
    fetchPedido();
  }, []);

  const handleDelete = (ID_Pedido) => {
    if (window.confirm("¿Estás seguro de eliminar este pedido?")) {
      deletePedido(ID_Pedido);
      fetchPedido();
    }
  };

  const handleEditClick = (pedido) => {
    setEditingPedido(pedido);
    setFormData({
      ID_Cliente: pedido.ID_Cliente,
      Fecha_Pedido: pedido.Fecha_Pedido,
      Fecha_Entrega: pedido.Fecha_Entrega,
    });
  };

  const handleInputChangeUpdate = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = () => {
    updatePedido(editingPedido.ID_Pedido, formData);
    fetchPedido();
    setEditingPedido(null);
  };

  const handleCancelEdit = () => {
    setEditingPedido(null);
  };

  return (
    <div className="ImagenFrom">
      <div className="lista">
        <h2>📋 Lista de Pedidos</h2>
        <div className="tablita">
          {pedidos.length === 0 && <p>No hay pedidos registrados.</p>}
          {pedidos.map((pedido) => (
            <div key={pedido.ID_Pedido}>
              <p><strong>ID:</strong> {pedido.ID_Pedido}</p>
              <p><strong>Cliente:</strong> {pedido.ID_Cliente}</p>
              <p><strong>Fecha Pedido:</strong> {pedido.Fecha_Pedido}</p>
              <p><strong>Fecha Entrega:</strong> {pedido.Fecha_Entrega}</p>
              <div className="botones">
                <button onClick={() => handleEditClick(pedido)}>✏️ Editar</button>
                <button onClick={() => handleDelete(pedido.ID_Pedido)}>🗑️ Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingPedido && (
        <div className="modal_overlay">
          <div className="modal_window">
            <span className="modal_close" onClick={handleCancelEdit}>&times;</span>
            <h3>✍️ Editar Pedido</h3>
            <input
              type="text"
              name="ID_Cliente"
              value={formData.ID_Cliente}
              onChange={handleInputChangeUpdate}
              placeholder="ID Cliente"
            />
            <input
              type="text"
              name="Fecha_Pedido"
              value={formData.Fecha_Pedido}
              onChange={handleInputChangeUpdate}
              placeholder="Fecha del Pedido"
            />
            <input
              type="text"
              name="Fecha_Entrega"
              value={formData.Fecha_Entrega}
              onChange={handleInputChangeUpdate}
              placeholder="Fecha de Entrega"
            />
            <div className="botones">
              <button onClick={handleUpdate}>💾 Guardar</button>
              <button onClick={handleCancelEdit}>❌ Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pedido;
