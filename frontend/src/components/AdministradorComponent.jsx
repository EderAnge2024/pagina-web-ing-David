// src/components/Administrador.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/AuthStore";
import stiloAdmin from './administrador.module.css';
import AdministradorFrom from "./Administrador/Administrador";
import ClienteForm from "./Administrador/Clientes";
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
    const navigate = useNavigate();
    const { logout, user } = useAuthStore(); 
    
    const handleNavClick = (component) => {
        setActivateComponent(component);
    };
    
    const goToMenu = () => {
        navigate('/');
    };
    
    const handleLogout = () => {
        logout();
        navigate('/loginFrom');
    };

    return(
        <div className={stiloAdmin.admin_panel}>
            {/* Sidebar */}
            <aside className={stiloAdmin.sidebar}>
                <div className={stiloAdmin.logo}>
                    Panel Admin
                </div>
                
                <ul className={stiloAdmin.nav_links}>
                    <li 
                        onClick={goToMenu}
                        className={stiloAdmin.menu_button}
                    >
                        🏠 Menu Principal
                    </li>
                    
                    <li 
                        onClick={() => handleNavClick('AdministradorFrom')}
                        className={activateComponent === 'AdministradorFrom' ? stiloAdmin.active : ''}
                    >
                        👤 Administradores
                    </li>
                    
                    <li 
                        onClick={() => handleNavClick('ClienteFrom')}
                        className={activateComponent === 'ClienteFrom' ? stiloAdmin.active : ''}
                    >
                        👥 Clientes
                    </li>
                    
                    <li 
                        onClick={() => handleNavClick('ImagenFrom')}
                        className={activateComponent === 'ImagenFrom' ? stiloAdmin.active : ''}
                    >
                        🖼️ Imágenes B,L
                    </li>
                    
                    <li 
                        onClick={() => handleNavClick('ProductosFrom')} 
                        className={activateComponent === 'ProductosFrom' ? stiloAdmin.active : ''}
                    >
                        📦 Productos
                    </li>
                    
                    <li 
                        onClick={() => handleNavClick('CategoriaFrom')}
                        className={activateComponent === 'CategoriaFrom' ? stiloAdmin.active : ''}
                    >
                        📂 Categorías
                    </li>
                    
                    <li 
                        onClick={() => handleNavClick('Empleado')}
                        className={activateComponent === 'Empleado' ? stiloAdmin.active : ''}
                    >
                        👷 Empleados
                    </li>
                    
                    <li 
                        onClick={() => handleNavClick('EstadoPedidoFrom')}
                        className={activateComponent === 'EstadoPedidoFrom' ? stiloAdmin.active : ''}
                    >
                        📊 Estado Pedidos
                    </li>
                    
                    <li 
                        onClick={() => handleNavClick('Proyecto')}
                        className={activateComponent === 'Proyecto' ? stiloAdmin.active : ''}
                    >
                        🚧 Proyectos
                    </li>
                    
                    <li 
                        onClick={() => handleNavClick('Pedido')}
                        className={activateComponent === 'Pedido' ? stiloAdmin.active : ''}
                    >
                        📋 Pedidos
                    </li>
                    
                    <li 
                        onClick={() => handleNavClick('Factura')}
                        className={activateComponent === 'Factura' ? stiloAdmin.active : ''}
                    >
                        🧾 Facturas
                    </li>
                    
                    <li 
                        onClick={() => handleNavClick('HistorialEstado')}
                        className={activateComponent === 'HistorialEstado' ? stiloAdmin.active : ''}
                    >
                        📈 Historial Estados
                    </li>
                    
                    <li 
                        onClick={() => handleNavClick('DetallePedidoFrom')}
                        className={activateComponent === 'DetallePedidoFrom' ? stiloAdmin.active : ''}
                    >
                        📝 Detalle Pedidos
                    </li>
                </ul>

                {/* Usuario y logout en la parte inferior del sidebar */}
                <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #374151' }}>
                    {user && (
                        <div style={{ marginBottom: '15px', fontSize: '14px', color: '#d1d5db' }}>
                            👋 Bienvenido, <strong>{user.nombre}</strong>
                        </div>
                    )}
                    <li 
                        onClick={handleLogout}
                        className={stiloAdmin.logout}
                    >
                        🚪 Cerrar Sesión
                    </li>
                </div>
            </aside>

            {/* Contenido principal */}
            <main className={stiloAdmin.dashboard}>
                {activateComponent === 'AdministradorFrom' && <AdministradorFrom/>}
                {activateComponent === 'ClienteFrom' && <ClienteForm/>}
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
            </main>
        </div>
    );
};

export default Administrador;