import React, { useEffect } from 'react';
import { useTerminosStore } from '../../store/TerminosStore'; // Ajusta la ruta según tu estructura

const TerminosCondiciones = () => {
  const { ultimo, loading, error, fetchUltimo } = useTerminosStore();

  useEffect(() => {
    fetchUltimo();
  }, []);

  if (loading) {
    return ( 
      <div style={{ 
        maxWidth: 700, 
        margin: '2rem auto', 
        padding: '2rem', 
        textAlign: 'center' 
      }}>
        <p>Cargando términos y condiciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        maxWidth: 700, 
        margin: '2rem auto', 
        padding: '2rem',
        background: '#fee',
        borderRadius: 8,
        border: '1px solid #fcc'
      }}>
        <p style={{ color: '#c33' }}>Error: {error}</p>
        <button 
          onClick={fetchUltimo}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Si no hay términos en el store, mostrar los términos por defecto
  if (!ultimo || !ultimo.contenido) {
    return (
      <div style={{ 
        maxWidth: 700, 
        margin: '2rem auto', 
        padding: '2rem', 
        background: '#fff', 
        borderRadius: 8, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)' 
      }}>
        <h2>Términos y Condiciones de Bradatec S.R.L.</h2>
        <ol style={{ lineHeight: 1.7 }}>
          <li><b>Generalidades:</b> Al realizar una compra en Bradatec S.R.L., el cliente acepta los presentes términos y condiciones. Bradatec S.R.L. se reserva el derecho de modificar estos términos en cualquier momento.</li>
          <li><b>Productos:</b> Todos los productos ofrecidos (cámaras, accesorios y servicios relacionados) son nuevos y cuentan con garantía según lo especificado en la descripción de cada producto.</li>
          <li><b>Precios y Pagos:</b> Los precios están expresados en moneda local e incluyen los impuestos aplicables. El pago debe realizarse en su totalidad antes del envío o entrega del producto.</li>
          <li><b>Envíos y Entregas:</b> Los envíos se realizan a la dirección proporcionada por el cliente. Los plazos de entrega pueden variar según la ubicación y disponibilidad del producto. Bradatec S.R.L. no se responsabiliza por retrasos causados por terceros (empresas de transporte).</li>
          <li><b>Garantía y Devoluciones:</b> Todos los productos cuentan con garantía contra defectos de fabricación. Para hacer válida la garantía, el cliente debe conservar la factura y el empaque original. No se aceptan devoluciones por mal uso o daños ocasionados por el cliente.</li>
          <li><b>Protección de Datos:</b> La información personal proporcionada por el cliente será utilizada únicamente para procesar la compra y no será compartida con terceros, salvo obligación legal.</li>
          <li><b>Responsabilidad:</b> Bradatec S.R.L. no se hace responsable por daños indirectos, incidentales o consecuentes derivados del uso o imposibilidad de uso de los productos adquiridos.</li>
          <li><b>Contacto:</b> Para cualquier consulta, reclamo o solicitud, el cliente puede comunicarse a través de los canales oficiales de Bradatec S.R.L.</li>
        </ol>
        <p style={{ 
          fontSize: '0.9rem', 
          color: '#666', 
          marginTop: '2rem',
          fontStyle: 'italic' 
        }}>
          (Términos por defecto - No se encontraron términos actualizados)
        </p>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: 700, 
      margin: '2rem auto', 
      padding: '2rem', 
      background: '#fff', 
      borderRadius: 8, 
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)' 
    }}>
      
      {/* Renderizar el contenido desde el store */}
      <div 
        style={{ lineHeight: 1.7 }}
        dangerouslySetInnerHTML={{ __html: ultimo.contenido }}
      />
      
      {/* Mostrar información adicional si está disponible */}
      {ultimo.fecha_creacion && (
        <p style={{ 
          fontSize: '0.9rem', 
          color: '#666', 
          marginTop: '2rem',
          fontStyle: 'italic' 
        }}>
          Última actualización: {new Date(ultimo.fecha_creacion).toLocaleDateString('es-ES')}
        </p>
      )}
    </div>
  );
};

export default TerminosCondiciones;