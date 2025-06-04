import { create } from 'zustand'
import axios from 'axios'

const useDashboardStore = create((set, get) => ({
    dashboardData: {
        totalVentas: 0,
        totalPedidos: 0,
        totalClientes: 0,
        totalProductos: 0,
        ventasHoy: 0,
        pedidosPendientes: 0,
        ventasSemanales: [],
        categoriasMasVendidas: [],
        pedidosPorEstado: [],
        ventasMensuales: [],
        actividadReciente: []
    },
    loading: false,
    error: null,

    // Función principal para cargar todos los datos del dashboard
    loadDashboardData: async () => {
        set({ loading: true, error: null });
        try {
            const store = get();
            await Promise.all([
                store.fetchTotales(),
                store.fetchVentasSemanales(),
                store.fetchCategoriasMasVendidas(),
                store.fetchPedidosPorEstado(),
                store.fetchVentasMensuales(),
                store.fetchActividadReciente()
            ]);
            set({ loading: false });
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            set({ error: error.message, loading: false });
        }
    },

    // Obtener totales generales
    fetchTotales: async () => {
        try {
            const [pedidosRes, clientesRes, productosRes, facturasRes] = await Promise.all([
                axios.get('http://localhost:3001/pedidos'),
                axios.get('http://localhost:3001/clientes'),
                axios.get('http://localhost:3001/productos'),
                axios.get('http://localhost:3001/factura')
            ]);

            const pedidos = pedidosRes.data;
            const clientes = clientesRes.data;
            const productos = productosRes.data;
            const facturas = facturasRes.data;

            // Calcular totales
            const totalVentas = facturas.reduce((sum, factura) => sum + parseFloat(factura.total || 0), 0);
            const totalPedidos = pedidos.length;
            const totalClientes = clientes.length;
            const totalProductos = productos.length;

            // Ventas de hoy (simulado - puedes ajustar según tu estructura de fechas)
            const hoy = new Date().toISOString().split('T')[0];
            const ventasHoy = facturas
                .filter(factura => factura.fecha_Factura?.includes(hoy))
                .reduce((sum, factura) => sum + parseFloat(factura.total || 0), 0);

            // Pedidos pendientes
            const pedidosPendientes = pedidos.filter(pedido => 
                pedido.ID_EstadoPedido === 1 || pedido.estado?.toLowerCase() === 'pendiente'
            ).length;

            set(state => ({
                dashboardData: {
                    ...state.dashboardData,
                    totalVentas,
                    totalPedidos,
                    totalClientes,
                    totalProductos,
                    ventasHoy,
                    pedidosPendientes
                }
            }));

        } catch (error) {
            console.error('Error fetching totales:', error);
            throw error;
        }
    },

    // Obtener ventas semanales
    fetchVentasSemanales: async () => {
        try {
            const response = await axios.get('http://localhost:3001/factura');
            const facturas = response.data;

            // Agrupar por día de la semana (últimos 7 días)
            const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
            const ventasSemanales = [];
            
            for (let i = 6; i >= 0; i--) {
                const fecha = new Date();
                fecha.setDate(fecha.getDate() - i);
                const diaIndex = fecha.getDay();
                const fechaStr = fecha.toISOString().split('T')[0];
                
                const ventasDia = facturas.filter(factura => 
                    factura.fecha_Factura?.includes(fechaStr)
                );
                
                const totalVentas = ventasDia.reduce((sum, factura) => 
                    sum + parseFloat(factura.total || 0), 0
                );
                
                ventasSemanales.push({
                    dia: diasSemana[diaIndex],
                    ventas: totalVentas,
                    pedidos: ventasDia.length
                });
            }

            set(state => ({
                dashboardData: {
                    ...state.dashboardData,
                    ventasSemanales
                }
            }));

        } catch (error) {
            console.error('Error fetching ventas semanales:', error);
            throw error;
        }
    },

    // Obtener categorías más vendidas
    fetchCategoriasMasVendidas: async () => {
        try {
            const [categoriasRes, productosRes, detallesRes] = await Promise.all([
                axios.get('http://localhost:3001/Categorias'),
                axios.get('http://localhost:3001/productos'),
                axios.get('http://localhost:3001/detallePedido')
            ]);

            const categorias = categoriasRes.data;
            const productos = productosRes.data;
            const detalles = detallesRes.data;

            // Calcular ventas por categoría
            const ventasPorCategoria = {};
            
            detalles.forEach(detalle => {
                const producto = productos.find(p => p.ID_Producto === detalle.ID_Producto);
                if (producto) {
                    const categoria = categorias.find(c => c.ID_Categoria === producto.ID_categoria);
                    if (categoria) {
                        const nombreCategoria = categoria.nombre_Categoria;
                        const ventaDetalle = parseFloat(detalle.cantidad || 0) * parseFloat(detalle.precio_Unitario || 0);
                        
                        if (!ventasPorCategoria[nombreCategoria]) {
                            ventasPorCategoria[nombreCategoria] = 0;
                        }
                        ventasPorCategoria[nombreCategoria] += ventaDetalle;
                    }
                }
            });

            // Convertir a array y calcular porcentajes
            const totalVentas = Object.values(ventasPorCategoria).reduce((sum, venta) => sum + venta, 0);
            const categoriasMasVendidas = Object.entries(ventasPorCategoria)
                .map(([name, ventas]) => ({
                    name,
                    value: totalVentas > 0 ? Math.round((ventas / totalVentas) * 100) : 0,
                    ventas
                }))
                .sort((a, b) => b.ventas - a.ventas)
                .slice(0, 5);

            set(state => ({
                dashboardData: {
                    ...state.dashboardData,
                    categoriasMasVendidas
                }
            }));

        } catch (error) {
            console.error('Error fetching categorías más vendidas:', error);
            throw error;
        }
    },

    // Obtener pedidos por estado
    fetchPedidosPorEstado: async () => {
        try {
            const [pedidosRes, estadosRes] = await Promise.all([
                axios.get('http://localhost:3001/pedidos'),
                axios.get('http://localhost:3001/estadoPedido')
            ]);

            const pedidos = pedidosRes.data;
            const estados = estadosRes.data;

            const pedidosPorEstado = {};
            
            pedidos.forEach(pedido => {
                const estado = estados.find(e => e.ID_EstadoPedido === pedido.ID_EstadoPedido);
                const nombreEstado = estado ? estado.nombre_Estado : 'Sin estado';
                
                pedidosPorEstado[nombreEstado] = (pedidosPorEstado[nombreEstado] || 0) + 1;
            });

            const colores = {
                'Completado': '#00C49F',
                'Pendiente': '#FFBB28',
                'En Proceso': '#0088FE',
                'Cancelado': '#FF8042',
                'Enviado': '#8884d8'
            };

            const pedidosEstadoData = Object.entries(pedidosPorEstado).map(([estado, cantidad]) => ({
                estado,
                cantidad,
                color: colores[estado] || '#82ca9d'
            }));

            set(state => ({
                dashboardData: {
                    ...state.dashboardData,
                    pedidosPorEstado: pedidosEstadoData
                }
            }));

        } catch (error) {
            console.error('Error fetching pedidos por estado:', error);
            throw error;
        }
    },

    // Obtener ventas mensuales
    fetchVentasMensuales: async () => {
        try {
            const response = await axios.get('http://localhost:3001/factura');
            const facturas = response.data;

            const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            const ventasMensuales = [];
            const currentDate = new Date();
            
            for (let i = 5; i >= 0; i--) {
                const fecha = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
                const mesIndex = fecha.getMonth();
                const año = fecha.getFullYear();
                
                const ventasMes = facturas.filter(factura => {
                    const fechaFactura = new Date(factura.fecha_Factura);
                    return fechaFactura.getMonth() === mesIndex && fechaFactura.getFullYear() === año;
                });
                
                const totalVentas = ventasMes.reduce((sum, factura) => 
                    sum + parseFloat(factura.total || 0), 0
                );
                
                // Objetivo simulado (puedes ajustarlo según tu lógica de negocio)
                const objetivo = totalVentas * 1.1; // 10% más que las ventas actuales
                
                ventasMensuales.push({
                    mes: meses[mesIndex],
                    ventas: totalVentas,
                    objetivo
                });
            }

            set(state => ({
                dashboardData: {
                    ...state.dashboardData,
                    ventasMensuales
                }
            }));

        } catch (error) {
            console.error('Error fetching ventas mensuales:', error);
            throw error;
        }
    },

    // Obtener actividad reciente
    fetchActividadReciente: async () => {
        try {
            const [pedidosRes, clientesRes, productosRes] = await Promise.all([
                axios.get('http://localhost:3001/pedidos'),
                axios.get('http://localhost:3001/clientes'),
                axios.get('http://localhost:3001/productos')
            ]);

            const pedidos = pedidosRes.data.slice(-5); // Últimos 5 pedidos
            const clientes = clientesRes.data.slice(-3); // Últimos 3 clientes
            const productos = productosRes.data.slice(-2); // Últimos 2 productos

            const actividades = [];

            // Agregar pedidos recientes
            pedidos.forEach(pedido => {
                actividades.push({
                    id: `pedido-${pedido.ID_Pedido}`,
                    icon: '🛒',
                    mensaje: `Nuevo pedido #${pedido.ID_Pedido} por S/. ${pedido.total || '0.00'}`,
                    tiempo: 'Hace 5 minutos'
                });
            });

            // Agregar clientes recientes
            clientes.forEach(cliente => {
                actividades.push({
                    id: `cliente-${cliente.ID_Cliente}`,
                    icon: '👤',
                    mensaje: `Nuevo cliente registrado: ${cliente.nombre_Cliente} ${cliente.apellido_Cliente}`,
                    tiempo: 'Hace 15 minutos'
                });
            });

            // Agregar productos recientes
            productos.forEach(producto => {
                actividades.push({
                    id: `producto-${producto.ID_Producto}`,
                    icon: '📦',
                    mensaje: `Producto "${producto.nombre_Producto}" agregado al inventario`,
                    tiempo: 'Hace 1 hora'
                });
            });

            // Ordenar por tiempo (simulado) y tomar los primeros 4
            const actividadReciente = actividades.slice(0, 4);

            set(state => ({
                dashboardData: {
                    ...state.dashboardData,
                    actividadReciente
                }
            }));

        } catch (error) {
            console.error('Error fetching actividad reciente:', error);
            throw error;
        }
    },

    // Función para actualizar un dato específico
    updateDashboardData: (key, value) => {
        set(state => ({
            dashboardData: {
                ...state.dashboardData,
                [key]: value
            }
        }));
    },

    // Función para limpiar errores
    clearError: () => {
        set({ error: null });
    }
}));

export default useDashboardStore;