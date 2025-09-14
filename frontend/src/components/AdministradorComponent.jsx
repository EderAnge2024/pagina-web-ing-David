// src/components/Administrador.jsx
import { useState, useEffect, useCallback, useMemo, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/AuthStore";
import stiloAdmin from './administrador.module.css';
import React from "react";

// Error Boundary Component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error Boundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-fallback">
                    <h2>Algo salió mal</h2>
                    <p>Error: {this.state.error?.message}</p>
                    <button onClick={() => this.setState({ hasError: false, error: null })}>
                        Intentar de nuevo
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

// Lazy loading de componentes para evitar conflictos
const LazyDashboardAdmin = lazy(() => import("./Administrador/DashboardAdmin"))
const LazyAdministradorFrom = lazy(() => import("./Administrador/Administrador"));
const LazyClienteFrom = lazy(() => import("./Administrador/Clientes"));
const LazyImagenFrom = lazy(() => import("./Administrador/imgFrom"));
const LazyProductosFrom = lazy(() => import("./Administrador/Productos"));
const LazyCategoriaFrom = lazy(() => import("./Administrador/Categoria"));
const LazyDetallePedidoFrom = lazy(() => import("./Administrador/DetallePedido"));
const LazyEmpleado = lazy(() => import("./Administrador/Empleado"));
const LazyEstadoPedidoFrom = lazy(() => import("./Administrador/EstadoPedido"));
const LazyFactura = lazy(() => import("./Administrador/Factura"));
const LazyHistorialEstado = lazy(() => import("./Administrador/HistorialEstado"));
const LazyPedido = lazy(() => import("./Administrador/Pedido"));
const LazyProyecto = lazy(() => import("./Administrador/Proyecto"));
const LazyTerminosAdmin = lazy(() => import("./Administrador/TerminosAdmin"));
const Lazycolors = lazy(() => import("./PaletaColores"));
const LazyInformacion = lazy(()=> import("./Administrador/informacionPie/Informacion"))

const LoadingSpinner = () => (
    <div className={stiloAdmin.componentLoading}>
        <div className={stiloAdmin.loadingSpinner}></div>
        <p>Cargando componente...</p>
    </div>
);

const Administrador = () => {
    const [activateComponent, setActivateComponent] = useState('DashboardAdmin');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [componentKey, setComponentKey] = useState(0); // Para forzar re-render
    
    const navigate = useNavigate();
    const { logout, user, isAuthenticated } = useAuthStore();
    
    // Configuración de navegación memoizada (sin Dashboard ya que estará en el menú principal)
    const navigationItems = useMemo(() => [
        { 
            key: 'AdministradorFrom', 
            label: 'Administradores', 
            icon: '👥',
            description: 'Gestionar administradores del sistema'
        },
        { 
            key: 'ClienteFrom', 
            label: 'Clientes', 
            icon: '👤',
            description: 'Administrar clientes registrados'
        },
        { 
            key: 'ImagenFrom', 
            label: 'Imágenes B.L', 
            icon: '🖼️',
            description: 'Gestionar imágenes del sistema'
        },
        { 
            key: 'ProductosFrom', 
            label: 'Productos', 
            icon: '📦',
            description: 'Catálogo de productos'
        },
        { 
            key: 'CategoriaFrom', 
            label: 'Categorías', 
            icon: '🏷️',
            description: 'Clasificación de productos'
        },
        { 
            key: 'Empleado', 
            label: 'Empleados', 
            icon: '👷',
            description: 'Personal de la empresa'
        },
        { 
            key: 'EstadoPedidoFrom', 
            label: 'Estado Pedidos', 
            icon: '📊',
            description: 'Estados de los pedidos'
        },
        { 
            key: 'Proyecto', 
            label: 'Proyectos', 
            icon: '🚀',
            description: 'Gestión de proyectos'
        },
        { 
            key: 'Pedido', 
            label: 'Pedidos', 
            icon: '📋',
            description: 'Órdenes de compra'
        },
        { 
            key: 'Factura', 
            label: 'Facturas', 
            icon: '🧾',
            description: 'Facturación y pagos'
        },
        { 
            key: 'HistorialEstado', 
            label: 'Historial Estados', 
            icon: '📈',
            description: 'Seguimiento de cambios'
        },
        { 
            key: 'DetallePedidoFrom', 
            label: 'Detalle Pedidos', 
            icon: '📝',
            description: 'Información detallada'
        },
        { 
            key: 'TerminosAdmin', 
            label: 'Terminos y condiciones', 
            icon: '📝',
            description: 'editar los terminos y condiciones'
        },
        { 
            key: 'Informacion', 
            label: 'Informacion footer', 
            icon: '📝',
            description: 'editar la informacion'
        },

    ], []);

    // Inicialización controlada
    useEffect(() => {
        const initializeComponent = async () => {
            try {
                // Verificar autenticación
                if (!isAuthenticated) {
                    navigate('/loginFrom');
                    return;
                }

                // Simular carga para evitar race conditions
                await new Promise(resolve => setTimeout(resolve, 100));

                // Cargar configuración
                const savedTheme = localStorage.getItem('adminTheme');
                const savedSidebar = localStorage.getItem('adminSidebar');
                
                if (savedTheme) {
                    setDarkMode(savedTheme === 'dark');
                }
                if (savedSidebar) {
                    setSidebarCollapsed(savedSidebar === 'collapsed');
                }

                setIsLoading(false);
            } catch (err) {
                console.error('Error inicializando:', err);
                setError('Error cargando el panel de administración');
                setIsLoading(false);
            }
        };

        initializeComponent();
    }, [isAuthenticated, navigate]);

    // Guardar configuración
    useEffect(() => {
        if (isLoading) return;
        
        try {
            localStorage.setItem('adminTheme', darkMode ? 'dark' : 'light');
        } catch (err) {
            console.error('Error guardando tema:', err);
        }
    }, [darkMode, isLoading]);

    useEffect(() => {
        if (isLoading) return;
        
        try {
            localStorage.setItem('adminSidebar', sidebarCollapsed ? 'collapsed' : 'expanded');
        } catch (err) {
            console.error('Error guardando sidebar:', err);
        }
    }, [sidebarCollapsed, isLoading]);
    
    const handleNavClick = useCallback((component) => {
        try {
            setError(null);
            if (component !== activateComponent) {
                setActivateComponent(component);
                // Incrementar key para forzar re-render limpio
                setComponentKey(prev => prev + 1);
            }
        } catch (err) {
            console.error('Error navegando:', err);
            setError('Error al cambiar de sección');
        }
    }, [activateComponent]);
    
    // Función modificada para ir al Dashboard en lugar del menú externo
    const goToDashboard = useCallback(() => {
        try {
            handleNavClick('DashboardAdmin');
        } catch (err) {
            console.error('Error navegando al dashboard:', err);
            setError('Error al cargar el dashboard');
        }
    }, [handleNavClick]);

    const goToPaleta = useCallback(() => {
        try {
            handleNavClick('colors');
        } catch (err) {
            console.error('Error navegando a la Paleta:', err);
            setError('Error al cargar la Paleta');
        }
    }, [handleNavClick]);

    const openMenuInNewTab = useCallback(() => {
        try {
            window.open('/', '_blank');
        } catch (err) {
            console.error('Error abriendo pestaña:', err);
        }
    }, []);
    
    const handleLogout = useCallback(async () => {
        try {
            setIsLoading(true);
            await logout();
            navigate('/loginFrom');
        } catch (err) {
            console.error('Error cerrando sesión:', err);
            window.location.href = '/loginFrom';
        }
    }, [logout, navigate]);

    const toggleSidebar = useCallback(() => {
        setSidebarCollapsed(prev => !prev);
    }, []);

    const toggleDarkMode = useCallback(() => {
        setDarkMode(prev => !prev);
    }, []);

    const getComponentTitle = useCallback(() => {
        if (activateComponent === 'DashboardAdmin') {
            return 'Dashboard';
        }
        const item = navigationItems.find(item => item.key === activateComponent);
        return item ? item.label : 'Panel de Administración';
    }, [activateComponent, navigationItems]);

    // Renderizado de componentes con error boundaries y lazy loading
    const renderActiveComponent = useMemo(() => {
        const componentMap = {
            'DashboardAdmin': <LazyDashboardAdmin/>,
            'AdministradorFrom': <LazyAdministradorFrom />,
            'ClienteFrom': <LazyClienteFrom />,
            'ImagenFrom': <LazyImagenFrom />,
            'ProductosFrom': <LazyProductosFrom />,
            'CategoriaFrom': <LazyCategoriaFrom />,
            'Empleado': <LazyEmpleado />,
            'EstadoPedidoFrom': <LazyEstadoPedidoFrom />,
            'Proyecto': <LazyProyecto />,
            'Pedido': <LazyPedido />,
            'Factura': <LazyFactura />,
            'HistorialEstado': <LazyHistorialEstado />,
            'DetallePedidoFrom': <LazyDetallePedidoFrom />,
            'TerminosAdmin': <LazyTerminosAdmin />,
            'colors': <Lazycolors />,
            'Informacion':<LazyInformacion></LazyInformacion>
        };

        const ActiveComponent = componentMap[activateComponent];

        if (!ActiveComponent) {
            return (
                <div className={stiloAdmin.errorContainer}>
                    <h2>Componente no encontrado</h2>
                    <p>El componente "{activateComponent}" no está disponible.</p>
                    <button 
                        onClick={() => handleNavClick('DashboardAdmin')}
                        className={stiloAdmin.errorButton}
                    >
                        Volver al Dashboard
                    </button>
                </div>
            );
        }

        return (
            <ErrorBoundary key={`error-boundary-${componentKey}`}>
                <Suspense fallback={<LoadingSpinner />}>
                    <div key={`component-${activateComponent}-${componentKey}`} className={stiloAdmin.componentContainer}>
                        {ActiveComponent}
                    </div>
                </Suspense>
            </ErrorBoundary>
        );
    }, [activateComponent, componentKey, handleNavClick]);

    if (isLoading) {
        return (
            <div className={stiloAdmin.loadingContainer}>
                <div className={stiloAdmin.loadingSpinner}></div>
                <p>Cargando panel de administración...</p>
            </div>
        );
    }

    return(
        <div className={`${stiloAdmin.container} ${darkMode ? stiloAdmin.darkMode : stiloAdmin.lightMode}`}>
            <aside className={`${stiloAdmin.sidebar} ${sidebarCollapsed ? stiloAdmin.collapsed : ''}`}>
                {/* Header del sidebar */}
                <div className={stiloAdmin.sidebarHeader}>
                    <div className={stiloAdmin.logo}>
                        <span className={stiloAdmin.logoIcon}>⚡</span>
                        {!sidebarCollapsed && <span className={stiloAdmin.logoText}>AdminPanel</span>}
                    </div>
                    <button 
                        onClick={toggleSidebar}
                        className={stiloAdmin.toggleButton}
                        title={sidebarCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
                        aria-label={sidebarCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
                    >
                        {sidebarCollapsed ? '→' : '←'}
                    </button>
                </div>

                {/* Botones de navegación principal */}
                <div className={stiloAdmin.quickActions}>
                    <button 
                        onClick={goToDashboard}
                        className={`${stiloAdmin.actionButton} ${activateComponent === 'DashboardAdmin' ? stiloAdmin.active : ''}`}
                        title="Dashboard - Panel principal de administración"
                        aria-label="Dashboard - Panel principal de administración"
                    >
                        <span className={stiloAdmin.actionIcon}>📊</span>
                        {!sidebarCollapsed && <span>Dashboard</span>}
                    </button>
                    {/* Paleta de colores, Raaa */}
                    <button 
                        onClick={goToPaleta}
                        className={stiloAdmin.actionButton}
                        title="Paleta de Colores_fondos-Encabezaso y pie, y, tipos letras"
                    >
                        <span className={stiloAdmin.actionIcon}>🎨 Paleta Colores</span>
                    </button>
                    <button 
                        onClick={openMenuInNewTab}
                        className={stiloAdmin.actionButton}
                        title="Abrir menú en nueva pestaña"
                        aria-label="Abrir menú en nueva pestaña"
                    >
                        <span className={stiloAdmin.actionIcon}>🔗</span>
                        {!sidebarCollapsed && <span>Ver Sitio</span>}
                    </button>
                    <button 
                        onClick={toggleDarkMode}
                        className={stiloAdmin.actionButton}
                        title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                        aria-label={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                    >
                        <span className={stiloAdmin.actionIcon}>{darkMode ? '☀️' : '🌙'}</span>
                        {!sidebarCollapsed && <span>{darkMode ? 'Modo Claro' : 'Modo Oscuro'}</span>}
                    </button>
                </div>

                {/* Navegación principal */}
                <nav className={stiloAdmin.nav}>
                    <div className={stiloAdmin.navSection}>
                        {!sidebarCollapsed && <h3 className={stiloAdmin.sectionTitle}>Gestión</h3>}
                        {navigationItems.map((item) => (
                            <button
                                key={item.key}
                                onClick={() => handleNavClick(item.key)}
                                className={`${stiloAdmin.navButton} ${
                                    activateComponent === item.key ? stiloAdmin.active : ''
                                }`}
                                title={sidebarCollapsed ? `${item.label} - ${item.description}` : item.description}
                                aria-label={`${item.label} - ${item.description}`}
                            >
                                <span className={stiloAdmin.navIcon}>{item.icon}</span>
                                {!sidebarCollapsed && (
                                    <div className={stiloAdmin.navContent}>
                                        <span className={stiloAdmin.navLabel}>{item.label}</span>
                                        <span className={stiloAdmin.navDescription}>{item.description}</span>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </nav>

                {/* Información del usuario */}
                <div className={stiloAdmin.userSection}>
                    {user && !sidebarCollapsed && (
                        <div className={stiloAdmin.userInfo}>
                            <div className={stiloAdmin.userAvatar}>
                                {(user.nombre || user.name || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div className={stiloAdmin.userDetails}>
                                <span className={stiloAdmin.userName}>
                                    {user.nombre || user.name || 'Usuario'}
                                </span>
                                <span className={stiloAdmin.userRole}>Administrador</span>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className={stiloAdmin.logoutButton}
                        title="Cerrar sesión"
                        aria-label="Cerrar sesión"
                        disabled={isLoading}
                    >
                        <span className={stiloAdmin.logoutIcon}>🚪</span>
                        {!sidebarCollapsed && <span>Cerrar Sesión</span>}
                    </button>
                </div>
            </aside>

            <main className={stiloAdmin.mainContent}>
                {/* Header principal */}
                <header className={stiloAdmin.mainHeader}>
                    <div className={stiloAdmin.headerContent}>
                        <h1 className={stiloAdmin.pageTitle}>{getComponentTitle()}</h1>
                        <div className={stiloAdmin.headerActions}>
                            <button 
                                onClick={toggleDarkMode}
                                className={stiloAdmin.themeToggle}
                                title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                                aria-label={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                            >
                                {darkMode ? '☀️' : '🌙'}
                            </button>
                            <div className={stiloAdmin.breadcrumb}>
                                <span>Admin</span>
                                <span className={stiloAdmin.breadcrumbSeparator}>›</span>
                                <span>{getComponentTitle()}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Contenido principal */}
                <div className={stiloAdmin.contentArea}>
                    {error && (
                        <div className={stiloAdmin.errorAlert}>
                            <span className={stiloAdmin.errorIcon}>⚠️</span>
                            <span>{error}</span>
                            <button 
                                onClick={() => setError(null)}
                                className={stiloAdmin.errorClose}
                                aria-label="Cerrar error"
                            >
                                ×
                            </button>
                        </div>
                    )}
                    
                    {/* Componente activo */}
                    {renderActiveComponent}
                </div>
            </main>
        </div>
    );
};

export default Administrador;