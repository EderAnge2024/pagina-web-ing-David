import jsPDF from 'jspdf'

export const generateFacturaPDF = ({ cliente, ventas, fecha }) => {
    const doc = new jsPDF()
    
    // Encabezado
    doc.setFontSize(18)
    doc.text('FACTURA', 105, 20, { align: 'center' })
    
    // Información del cliente
    doc.setFontSize(12)
    doc.text(`Cliente: ${cliente.Nombre_Cliente}`, 20, 40)
    doc.text(`Número: ${cliente.Num_Cliente}`, 20, 50)
    doc.text(`Fecha: ${fecha}`, 20, 60)
    
    // Tabla de ventas
    let y = 80
    doc.text('Detalle de ventas:', 20, y)
    y += 10
    
    // Encabezados de tabla
    doc.text('ID Venta', 20, y)
    doc.text('Fecha', 60, y)
    doc.text('Total', 120, y)
    y += 10
    
    // Filas de tabla
    ventas.forEach(venta => {
        doc.text(venta.ID_Venta.toString(), 20, y)
        doc.text(venta.Fecha, 60, y)
        doc.text(`$${venta.Total.toFixed(2)}`, 120, y)
        y += 10
    })
    
    // Total
    const total = ventas.reduce((sum, venta) => sum + venta.Total, 0)
    doc.text(`TOTAL: $${total.toFixed(2)}`, 120, y + 10)
    
    // Guardar el PDF
    doc.save(`Factura_${cliente.Num_Cliente}_${fecha.replace(/\//g, '-')}.pdf`)
}