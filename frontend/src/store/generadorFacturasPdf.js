import jsPDF from 'jspdf'

export const generateFacturaPDF = ({ pedido, cliente, detalles, factura, total }) => {
    const doc = new jsPDF()
     
    // Configuración de colores y estilos
    const primaryColor = [41, 128, 185] // Azul
    const secondaryColor = [52, 73, 94] // Gris oscuro
    const accentColor = [231, 76, 60] // Rojo
    
    // Encabezado principal
    doc.setFillColor(...primaryColor)
    doc.rect(0, 0, 210, 30, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('BOLETA DE VENTA', 105, 20, { align: 'center' })
    
    // Información de la empresa (opcional)
    doc.setTextColor(...secondaryColor)
    doc.setFontSize(10)
    doc.text('Tu Empresa', 20, 40)
    doc.text('Dirección de la empresa', 20, 45)
    doc.text('Teléfono: +51 999 999 999', 20, 50)
    
    // Número de factura y fecha
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(`Boleta N°: ${factura.ID_Factura || 'PENDIENTE'}`, 140, 40)
    doc.text(`Pedido N°: ${pedido.ID_Pedido || 'NUEVO'}`, 140, 45)
    doc.text(`Fecha: ${factura.Fecha || new Date().toLocaleDateString()}`, 140, 50)
    
    // Línea separadora
    doc.setDrawColor(...primaryColor)
    doc.setLineWidth(0.5)
    doc.line(20, 60, 190, 60)
    
    // Información del cliente
    doc.setTextColor(...secondaryColor)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('DATOS DEL CLIENTE', 20, 75)
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(`Cliente: ${cliente.Nombre} ${cliente.Apellido}`, 20, 85)
    doc.text(`Teléfono: ${cliente.NumCelular}`, 20, 92)
    if (cliente.Email) {
        doc.text(`Email: ${cliente.Email}`, 20, 99)
    }
    if (cliente.Direccion) {
        doc.text(`Dirección: ${cliente.Direccion}`, 20, cliente.Email ? 106 : 99)
    }
    
    // Información del pedido
    const infoY = cliente.Email && cliente.Direccion ? 115 : (cliente.Email || cliente.Direccion ? 108 : 101)
    doc.setFontSize(11)
    doc.text(`Fecha de Pedido: ${pedido.Fecha_Pedido || 'Hoy'}`, 20, infoY)
    doc.text(`Fecha de Entrega: ${pedido.Fecha_Entrega || 'Por definir'}`, 20, infoY + 7)
    
    if (pedido.Observaciones) {
        doc.text(`Observaciones: ${pedido.Observaciones}`, 20, infoY + 14)
    }
    
    // Tabla de productos
    const tableStartY = infoY + (pedido.Observaciones ? 25 : 18)
    
    // Encabezado de la tabla
    doc.setFillColor(...primaryColor)
    doc.rect(20, tableStartY, 170, 10, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('PRODUCTO', 25, tableStartY + 7)
    doc.text('CANT.', 110, tableStartY + 7)
    doc.text('PRECIO UNIT.', 130, tableStartY + 7)
    doc.text('SUBTOTAL', 165, tableStartY + 7)
    
    // Filas de la tabla
    let currentY = tableStartY + 15
    doc.setTextColor(...secondaryColor)
    doc.setFont('helvetica', 'normal')
    
    detalles.forEach((detalle, index) => {
        // Alternar color de fondo para mejor legibilidad
        if (index % 2 === 0) {
            doc.setFillColor(245, 245, 245)
            doc.rect(20, currentY - 5, 170, 10, 'F')
        }
        
        // Limitar el nombre del producto si es muy largo
        const nombreProducto = detalle.Nombre_Producto.length > 25 
            ? detalle.Nombre_Producto.substring(0, 25) + '...' 
            : detalle.Nombre_Producto
        
        doc.text(nombreProducto, 25, currentY)
        doc.text(detalle.Cantidad.toString(), 115, currentY, { align: 'center' })
        doc.text(`$${detalle.Precio_Unitario.toFixed(2)}`, 145, currentY, { align: 'center' })
        doc.text(`$${detalle.Subtotal.toFixed(2)}`, 175, currentY, { align: 'center' })
        
        currentY += 10
    })
    
    // Línea separadora antes del total
    doc.setDrawColor(...primaryColor)
    doc.line(20, currentY + 5, 190, currentY + 5)
    
    // Total
    doc.setFillColor(...accentColor)
    doc.rect(130, currentY + 10, 60, 12, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(`TOTAL: $${total.toFixed(2)}`, 160, currentY + 18, { align: 'center' })
    
    // Pie de página
    const footerY = currentY + 35
    doc.setTextColor(...secondaryColor)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'italic')
    doc.text('Gracias por su compra', 105, footerY, { align: 'center' })
    doc.text(`Generado el ${new Date().toLocaleString()}`, 105, footerY + 5, { align: 'center' })
    
    // Generar nombre del archivo
    const fechaArchivo = new Date().toLocaleDateString().replace(/\//g, '-')
    const nombreArchivo = `Boleta_${cliente.Nombre}_${cliente.Apellido}_${fechaArchivo}.pdf`
    
    // Guardar el PDF
    doc.save(nombreArchivo)
    
    return {
        success: true,
        filename: nombreArchivo,
        message: 'PDF generado exitosamente'
    }
}