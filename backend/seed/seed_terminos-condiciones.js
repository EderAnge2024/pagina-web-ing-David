const TerminosCondiciones = require('../models/TerminosCondiciones');

async function seedTerminosCondiciones() {
  const count = await TerminosCondiciones.count();
  if (count === 0) {
    await TerminosCondiciones.create({
      contenido: `<h2>Términos y Condiciones de Bradatec S.R.L.</h2>
      <ol>
        <li><b>Generalidades:</b> Al realizar una compra en Bradatec S.R.L., el cliente acepta los presentes términos y condiciones. Bradatec S.R.L. se reserva el derecho de modificar estos términos en cualquier momento.</li>
        <li><b>Productos:</b> Todos los productos ofrecidos (cámaras, accesorios y servicios relacionados) son nuevos y cuentan con garantía según lo especificado en la descripción de cada producto.</li>
        <li><b>Precios y Pagos:</b> Los precios están expresados en moneda local e incluyen los impuestos aplicables. El pago debe realizarse en su totalidad antes del envío o entrega del producto.</li>
        <li><b>Envíos y Entregas:</b> Los envíos se realizan a la dirección proporcionada por el cliente. Los plazos de entrega pueden variar según la ubicación y disponibilidad del producto. Bradatec S.R.L. no se responsabiliza por retrasos causados por terceros (empresas de transporte).</li>
        <li><b>Garantía y Devoluciones:</b> Todos los productos cuentan con garantía contra defectos de fabricación. Para hacer válida la garantía, el cliente debe conservar la factura y el empaque original. No se aceptan devoluciones por mal uso o daños ocasionados por el cliente.</li>
        <li><b>Protección de Datos:</b> La información personal proporcionada por el cliente será utilizada únicamente para procesar la compra y no será compartida con terceros, salvo obligación legal.</li>
        <li><b>Responsabilidad:</b> Bradatec S.R.L. no se hace responsable por daños indirectos, incidentales o consecuentes derivados del uso o imposibilidad de uso de los productos adquiridos.</li>
        <li><b>Contacto:</b> Para cualquier consulta, reclamo o solicitud, el cliente puede comunicarse a través de los canales oficiales de Bradatec S.R.L.</li>
      </ol>`,
      fecha_actualizacion: new Date(),
    });
    console.log('Términos y condiciones por defecto insertados.');
  }
}

module.exports = seedTerminosCondiciones; 