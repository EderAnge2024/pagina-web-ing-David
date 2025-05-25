// src/components/Administrador.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import stiloAdmin from './administrador.module.css';
import AdministradorFrom from "./Administrador/Administrador";
import ClienteFrom from "./Administrador/Clientes";
import ImagenFrom from "./Administrador/imgFrom";
import ProductosFrom from "./Administrador/Productos";
import CategoriaFrom from "./Administrador/Categoria";
import DetallePedidoFrom from "./Administrador/DetallePedido";
import Empleado from "./Administrador/Empleado";
import EstadoPedidoFrom from "./Administrador/EstadoPedido";
import Factura from "./Administrador/Factura";
import HistorialEstado from "./Administrador/HistorialEstado"; 
import Pedido from "./Administrador/Pedido";
import Proyecto from "./Administrador/Proyecto";

const Administrador = () => {
    const [activateComponent, setActivateComponent] = useState('AdministradorFrom');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();
    const { logout, user } = useAuthStore(); 
    
    // Configuración de navegación con iconos y descripciones
    const navigationItems = [
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
        }
    ];
    
    const handleNavClick = (component) => {
        setActivateComponent(component);
    };
    
    const goToMenu = () => {
        navigate('/');
    };

    const openMenuInNewTab = () => {
        window.open('/', '_blank');
    };
    
    const handleLogout = () => {
        logout();
        navigate('/loginFrom');
    };

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const getComponentTitle = () => {
        const item = navigationItems.find(item => item.key === activateComponent);
        return item ? item.label : 'Panel de Administración';
    };

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
                    >
                        {sidebarCollapsed ? '→' : '←'}
                    </button>
                </div>

                {/* Botones de navegación principal */}
                <div className={stiloAdmin.quickActions}>
                    <button 
                        onClick={goToMenu}
                        className={stiloAdmin.actionButton}
                        title="Ir al menú principal"
                    >
                        <span className={stiloAdmin.actionIcon}>🏠</span>
                        {!sidebarCollapsed && <span>Menú Principal</span>}
                    </button>
                    <button 
                        onClick={openMenuInNewTab}
                        className={stiloAdmin.actionButton}
                        title="Abrir menú en nueva pestaña"
                    >
                        <span className={stiloAdmin.actionIcon}>🔗</span>
                        {!sidebarCollapsed && <span>Ver Sitio</span>}
                    </button>
                    <button 
                        onClick={toggleDarkMode}
                        className={stiloAdmin.actionButton}
                        title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
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
                                {user.nombre.charAt(0).toUpperCase()}
                            </div>
                            <div className={stiloAdmin.userDetails}>
                                <span className={stiloAdmin.userName}>{user.nombre}</span>
                                <span className={stiloAdmin.userRole}>Administrador</span>
                            </div>
                        </div>
                    )}
                    <button 
                        onClick={handleLogout}
                        className={stiloAdmin.logoutButton}
                        title="Cerrar sesión"
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
                    {activateComponent === 'AdministradorFrom' && <AdministradorFrom/>}
                    {activateComponent === 'ClienteFrom' && <ClienteFrom/>}
                    {activateComponent === 'ImagenFrom' && <ImagenFrom/>}
                    {activateComponent === 'ProductosFrom' && <ProductosFrom/>}
                    {activateComponent === 'CategoriaFrom' && <CategoriaFrom/>}
                    {activateComponent === 'Empleado' && <Empleado/>}
                    {activateComponent === 'EstadoPedidoFrom' && <EstadoPedidoFrom/>}
                    {activateComponent === 'Proyecto' && <Proyecto/>}
                    {activateComponent === 'Pedido' && <Pedido/>}
                    {activateComponent === 'Factura' && <Factura/>}
                    {activateComponent === 'HistorialEstado' && <HistorialEstado/>}
                    {activateComponent === 'DetallePedidoFrom' && <DetallePedidoFrom/>}
                </div>
            </main>
        </div>
    );
};

export default Administrador;