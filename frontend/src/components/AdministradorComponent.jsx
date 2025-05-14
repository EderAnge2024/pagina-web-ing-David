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
        <div>
            <header>
                <nav className={stiloAdmin.nav}>
                    <div className={stiloAdmin.navLeft}>
                        <button onClick={goToMenu}>Menu Principal</button>
                        <button onClick={() => handleNavClick('AdministradorFrom')}>Administradores</button>
                        <button onClick={() => handleNavClick('ClienteFrom')}>Clientes</button>
                        <button onClick={() => handleNavClick('ImagenFrom')}>Imagenes B,L</button>
                        <button onClick={() => handleNavClick('ProductosFrom')}>Productos</button>
                        <button onClick={() => handleNavClick('CategoriaFrom')}>Categoria</button>
                        <button onClick={() => handleNavClick('Empleado')}>Empleados</button>
                        <button onClick={() => handleNavClick('EstadoPedidoFrom')}>Estado del Pedidos</button>
                        <button onClick={() => handleNavClick('Proyecto')}>Proyectos</button>
                        <button onClick={() => handleNavClick('Pedido')}>Pedidos</button>
                        <button onClick={() => handleNavClick('Factura')}>Facturas</button>
                        <button onClick={() => handleNavClick('HistorialEstado')}>Historial de Estados</button>
                        <button onClick={() => handleNavClick('DetallePedidoFrom')}>Detalle del Pedido</button>
                    </div>
                    <div className={stiloAdmin.navRight}>
                        {user && <span>Bienvenido, {user.nombre}</span>}
                        <button onClick={handleLogout}>Cerrar Sesión</button>
                    </div>
                </nav>
            </header>
            <main>
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