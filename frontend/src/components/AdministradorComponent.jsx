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
        <div className={stiloAdmin.container}>
            <header>
                <nav className={stiloAdmin.nav}>
                    <div className={stiloAdmin.navLeft}>
                        <button 
                            onClick={goToMenu}
                            className={stiloAdmin.menuButton}
                        >
                            Menu Principal
                        </button>
                        <button 
                            onClick={() => handleNavClick('AdministradorFrom')}
                            className={activateComponent === 'AdministradorFrom' ? stiloAdmin.active : ''}
                        >
                            Administradores
                        </button>
                        <button 
                            onClick={() => handleNavClick('ClienteFrom')}
                            className={activateComponent === 'ClienteFrom' ? stiloAdmin.active : ''}
                        >
                            Clientes
                        </button>
                        <button 
                            onClick={() => handleNavClick('ImagenFrom')}
                            className={activateComponent=== 'ImagenFrom' ? stiloAdmin.active : ''}
                        >
                            Imagenes B,L
                        </button>
                        <button 
                            onClick={() => handleNavClick('ProductosFrom')} 
                            className={activateComponent=== 'ProductosFrom' ? stiloAdmin.active : ''}
                        >
                            Productos
                        </button>
                        <button 
                            onClick={() => handleNavClick('CategoriaFrom')}
                            className={activateComponent=== 'CategoriaFrom' ? stiloAdmin.active : ''}
                        >
                            Categoria
                        </button>
                        <button 
                            onClick={() => handleNavClick('Empleado')}
                            className={activateComponent=== 'Empleado' ? stiloAdmin.active : ''}
                        >
                            Empleados
                        </button>
                        <button 
                            onClick={() => handleNavClick('EstadoPedidoFrom')}
                            className={activateComponent=== 'EsatodoPedidoFrom' ? stiloAdmin.active : ''}
                        >
                            Estado del Pedidos
                        </button>
                        <button 
                            onClick={() => handleNavClick('Proyecto')}
                            className={activateComponent=== 'Proyecto' ? stiloAdmin.active : ''}
                        >
                            Proyectos
                        </button>
                        <button 
                            onClick={() => handleNavClick('Pedido')}
                            className={activateComponent=== 'Pedido' ? stiloAdmin.active : ''}
                        >
                            Pedidos
                        </button>
                        <button 
                            onClick={() => handleNavClick('Factura')}
                            className={activateComponent=== 'Factura' ? stiloAdmin.active : ''}
                        >
                            Facturas
                        </button>
                        <button 
                            onClick={() => handleNavClick('HistorialEstado')}
                            className={activateComponent=== 'HistorialEstado' ? stiloAdmin.active : ''}
                        >
                            Historial de Estados
                        </button>
                        <button 
                            onClick={() => handleNavClick('DetallePedidoFrom')}
                            className={activateComponent=== 'DetallePedidoFrom' ? stiloAdmin.active : ''}
                        >
                            Detalle del Pedido
                        </button>

                    </div>
                    <div className={stiloAdmin.navRight}>
                        {user && (
                            <span className={stiloAdmin.welcomeMessage}>
                                Bienvenido, <strong>{user.nombre}</strong>
                            </span> 
                        )}
                        <button 
                            onClick={handleLogout}
                            className={stiloAdmin.logoutButton}
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </nav>
            </header>
            <main className={stiloAdmin.mainContent}>
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
            </main>
        </div>
    );
};

export default Administrador;