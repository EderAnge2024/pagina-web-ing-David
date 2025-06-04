// src/components/Administrador/Dashboard.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer, 
    BarChart, 
    Bar, 
    PieChart, 
    Pie, 
    Cell, 
    AreaChart, 
    Area 
} from 'recharts';
import stiloDashboard from './DashboardAdmin.module.css';
import useDashboardStore from '../../store/DashboardStore';

// Datos por defecto para evitar errores cuando no hay datos
const DEFAULT_DASHBOARD_DATA = {
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
};

const Dashboard = () => {
    const { 
        dashboardData = DEFAULT_DASHBOARD_DATA, 
        loading = false, 
        error, 
        loadDashboardData, 
        clearError 
    } = useDashboardStore();

    const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

    // Colores para los gráficos
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    // Función memoizada para formatear moneda
    const formatCurrency = useCallback((value) => {
        if (typeof value !== 'number' || isNaN(value)) return 'S/ 0.00';
        
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(value);
    }, []);

    // Función memoizada para cargar datos
    const handleLoadData = useCallback(async () => {
        try {
            await loadDashboardData();
            setLastUpdateTime(new Date());
        } catch (err) {
            console.error('Error cargando datos del dashboard:', err);
        }
    }, [loadDashboardData]);

    // Datos seguros para los gráficos
    const safeData = useMemo(() => ({
        ventasSemanales: Array.isArray(dashboardData.ventasSemanales) ? dashboardData.ventasSemanales : [],
        categoriasMasVendidas: Array.isArray(dashboardData.categoriasMasVendidas) ? dashboardData.categoriasMasVendidas : [],
        pedidosPorEstado: Array.isArray(dashboardData.pedidosPorEstado) ? dashboardData.pedidosPorEstado : [],
        ventasMensuales: Array.isArray(dashboardData.ventasMensuales) ? dashboardData.ventasMensuales : [],
        actividadReciente: Array.isArray(dashboardData.actividadReciente) ? dashboardData.actividadReciente : []
    }), [dashboardData]);

    // Efecto para cargar datos iniciales
    useEffect(() => {
        handleLoadData();
    }, [handleLoadData]);

    // Efecto para auto-actualización
    useEffect(() => {
        const interval = setInterval(() => {
            if (!loading) {
                handleLoadData();
            }
        }, 300000); // 5 minutos

        return () => clearInterval(interval);
    }, [handleLoadData, loading]);

    // Componente de tarjeta de estadísticas
    const StatCard = ({ title, value, icon, trend, color = 'blue' }) => {
        const safeValue = value ?? 0;
        const safeTrend = typeof trend === 'number' ? trend : null;

        return (
            <div className={`${stiloDashboard.statCard} ${stiloDashboard[color]}`}>
                <div className={stiloDashboard.statHeader}>
                    <span className={stiloDashboard.statIcon}>{icon || '📊'}</span>
                    <span className={stiloDashboard.statTitle}>{title || 'Sin título'}</span>
                </div>
                <div className={stiloDashboard.statValue}>
                    {loading ? (
                        <div className={stiloDashboard.loadingContainer}>
                            <div className={stiloDashboard.spinner}></div>
                            <span>Cargando...</span>
                        </div>
                    ) : (
                        typeof safeValue === 'number' && safeValue > 1000 ? 
                        formatCurrency(safeValue) : 
                        safeValue.toLocaleString('es-PE')
                    )}
                </div>
                {safeTrend !== null && !loading && (
                    <div className={`${stiloDashboard.statTrend} ${safeTrend > 0 ? stiloDashboard.positive : stiloDashboard.negative}`}>
                        <span>{safeTrend > 0 ? '↗' : '↘'}</span>
                        <span>{Math.abs(safeTrend).toFixed(1)}%</span>
                    </div>
                )}
            </div>
        );
    };

    // Componente de carga para gráficos
    const ChartLoading = () => (
        <div className={stiloDashboard.chartLoading}>
            <div className={stiloDashboard.spinner}></div>
            <p>Cargando datos...</p>
        </div>
    );

    // Componente de gráfico vacío
    const EmptyChart = ({ message = "No hay datos disponibles" }) => (
        <div className={stiloDashboard.emptyChart}>
            <span className={stiloDashboard.emptyIcon}>📊</span>
            <p>{message}</p>
        </div>
    );

    // Tooltip personalizado para formato de moneda
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={stiloDashboard.customTooltip}>
                    <p className={stiloDashboard.tooltipLabel}>{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                            {entry.name}: {
                                entry.name === 'ventas' || entry.name === 'objetivo' ? 
                                formatCurrency(entry.value) : 
                                entry.value
                            }
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Manejo de errores
    if (error) {
        return (
            <div className={stiloDashboard.dashboard}>
                <div className={stiloDashboard.errorContainer}>
                    <div className={stiloDashboard.errorIcon}>⚠️</div>
                    <h2>Error al cargar el dashboard</h2>
                    <p>{error}</p>
                    <button 
                        onClick={() => {
                            clearError();
                            handleLoadData();
                        }}
                        className={stiloDashboard.retryButton}
                        disabled={loading}
                    >
                        {loading ? 'Reintentando...' : 'Reintentar'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={stiloDashboard.dashboard}>
            <div className={stiloDashboard.dashboardHeader}>
                <h1>Dashboard Administrativo</h1>
                <p>Resumen general del sistema</p>
                <div className={stiloDashboard.refreshContainer}>
                    <button 
                        onClick={handleLoadData} 
                        disabled={loading}
                        className={stiloDashboard.refreshButton}
                        aria-label="Actualizar datos del dashboard"
                    >
                        <span className={loading ? stiloDashboard.spinning : ''}>🔄</span>
                        {loading ? ' Actualizando...' : ' Actualizar'}
                    </button>
                    <span className={stiloDashboard.lastUpdate}>
                        Última actualización: {lastUpdateTime.toLocaleTimeString('es-PE')}
                    </span>
                </div>
            </div>

            {/* Tarjetas de estadísticas */}
            <div className={stiloDashboard.statsGrid}>
                <StatCard
                    title="Ventas Totales"
                    value={dashboardData.totalVentas}
                    icon="💰"
                    trend={12.5}
                    color="green"
                />
                <StatCard
                    title="Total Pedidos"
                    value={dashboardData.totalPedidos}
                    icon="📦"
                    trend={8.2}
                    color="blue"
                />
                <StatCard
                    title="Clientes Activos"
                    value={dashboardData.totalClientes}
                    icon="👥"
                    trend={5.4}
                    color="purple"
                />
                <StatCard
                    title="Productos"
                    value={dashboardData.totalProductos}
                    icon="🏷️"
                    trend={-2.1}
                    color="orange"
                />
                <StatCard
                    title="Ventas Hoy"
                    value={dashboardData.ventasHoy}
                    icon="📈"
                    trend={15.8}
                    color="teal"
                />
                <StatCard
                    title="Pedidos Pendientes"
                    value={dashboardData.pedidosPendientes}
                    icon="⏳"
                    trend={-3.2}
                    color="red"
                />
            </div>

            {/* Gráficos principales */}
            <div className={stiloDashboard.chartsGrid}>
                {/* Ventas Semanales */}
                <div className={stiloDashboard.chartCard}>
                    <h3>Ventas de la Semana</h3>
                    {loading ? (
                        <ChartLoading />
                    ) : safeData.ventasSemanales.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={safeData.ventasSemanales}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="dia" />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="ventas"
                                    stroke="#0088FE"
                                    fill="#0088FE"
                                    fillOpacity={0.3}
                                    name="Ventas"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyChart message="No hay datos de ventas semanales" />
                    )}
                </div>

                {/* Categorías más vendidas */}
                <div className={stiloDashboard.chartCard}>
                    <h3>Categorías Más Vendidas</h3>
                    {loading ? (
                        <ChartLoading />
                    ) : safeData.categoriasMasVendidas.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={safeData.categoriasMasVendidas}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {safeData.categoriasMasVendidas.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value}%`, 'Porcentaje']} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyChart message="No hay datos de categorías" />
                    )}
                </div>

                {/* Estados de Pedidos */}
                <div className={stiloDashboard.chartCard}>
                    <h3>Estado de Pedidos</h3>
                    {loading ? (
                        <ChartLoading />
                    ) : safeData.pedidosPorEstado.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={safeData.pedidosPorEstado}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="estado" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="cantidad" fill="#8884d8">
                                    {safeData.pedidosPorEstado.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyChart message="No hay datos de estados de pedidos" />
                    )}
                </div>

                {/* Ventas vs Objetivo Mensual */}
                <div className={stiloDashboard.chartCard}>
                    <h3>Ventas vs Objetivo Mensual</h3>
                    {loading ? (
                        <ChartLoading />
                    ) : safeData.ventasMensuales.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={safeData.ventasMensuales}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="mes" />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="ventas"
                                    stroke="#00C49F"
                                    strokeWidth={3}
                                    name="Ventas Reales"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="objetivo"
                                    stroke="#FF8042"
                                    strokeDasharray="5 5"
                                    name="Objetivo"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyChart message="No hay datos de ventas mensuales" />
                    )}
                </div>
            </div>

            {/* Actividad reciente */}
            <div className={stiloDashboard.activitySection}>
                <h3>Actividad Reciente</h3>
                {loading ? (
                    <div className={stiloDashboard.activityLoading}>
                        <div className={stiloDashboard.spinner}></div>
                        <p>Cargando actividad...</p>
                    </div>
                ) : safeData.actividadReciente.length > 0 ? (
                    <div className={stiloDashboard.activityList}>
                        {safeData.actividadReciente.map((actividad, index) => (
                            <div key={actividad.id || `activity-${index}`} className={stiloDashboard.activityItem}>
                                <span className={stiloDashboard.activityIcon}>
                                    {actividad.icon || '📝'}
                                </span>
                                <div className={stiloDashboard.activityContent}>
                                    <p>{actividad.mensaje || 'Actividad sin descripción'}</p>
                                    <span className={stiloDashboard.activityTime}>
                                        {actividad.tiempo || 'Tiempo no disponible'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={stiloDashboard.noActivity}>
                        <span className={stiloDashboard.emptyIcon}>📝</span>
                        <p>No hay actividad reciente disponible</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;