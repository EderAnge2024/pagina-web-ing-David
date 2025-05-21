import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdministradorFrom from "./Administrador/Administrador"
import ClienteFrom from "./Administrador/Clientes"
import ImagenFrom from "./Administrador/imgFrom"
import ProductosFrom from "./Administrador/Productos"
import CategoriaFrom from "./Administrador/Categoria"
import DetallePedidoFrom from "./Administrador/DetallePedido"
import Empleado from "./Administrador/Empleado"
import EstadoPedidoFrom from "./Administrador/EstadoPedido"
import Factura from "./Administrador/Factura"
import HistorialEstado from "./Administrador/HistorialEstado"
import Pedido from "./Administrador/Pedido"
import Proyecto from "./Administrador/Proyecto"
import useAuthStore from "../store/AuthStore"
import stiloAdmin from './administrador.module.css'
import useClienteStore from "../store/ClienteStore"
import usePedidoStore from "../store/PedidoStore"
import useEstadoPedidoStore from "../store/EstadoPedidoStore"
import useHistorialEstadoStore from "../store/HistorialEstadoStore"

const Administrador = () => {

    const { clientes, fetchCliente } = useClienteStore();
    const { pedidos, fetchPedido } = usePedidoStore();
    const { estadoPedidos, fetchEstadoPedido } = useEstadoPedidoStore();
    const { historialEstados, fetchHistorialEstado } = useHistorialEstadoStore();

    const [activateComponent, setActivateComponent] = useState(null)
    const [showSubmenu, setShowSubmenu] = useState(false)
    const navigate = useNavigate()
    const { logout } = useAuthStore();

    const handleNavClick = (component) => setActivateComponent(component)
    const goToTienda = () => {
    window.open('/', '_blank') // abre en una nueva pestaña
    }
    useEffect(() => {
    fetchCliente();
    fetchPedido();
    fetchEstadoPedido();
    fetchHistorialEstado();
    const interval = setInterval(() => {
        fetchCliente();
        fetchPedido();
        fetchEstadoPedido();
        fetchHistorialEstado();
    }, 5000);
    return () => clearInterval(interval);
    }, [fetchCliente,fetchPedido, fetchEstadoPedido,fetchHistorialEstado]);

    const estadoEnProceso = estadoPedidos.find(
       (estado) => estado.Estado === 'En Proceso'
    );

    const tareasPendientes = estadoEnProceso 
        ? historialEstados.filter(
            (historial) => historial.ID_EstadoPedido === estadoEnProceso.ID_EstadoPedido
          )
        : [];
    return (
        <div className={stiloAdmin.admin_panel}>
            <aside className={stiloAdmin.sidebar}>
                <h2 className={stiloAdmin.logo}>BRADATEC</h2>
                <ul className={stiloAdmin.nav_links}>
                    <li onClick={() => setActivateComponent(null)}>Inicio</li>

                    {/* Sección de productos con submenú */}
                    <li onClick={() => setShowSubmenu(!showSubmenu)}>
                        Productos ▾
                    </li>
                    {showSubmenu && (
                        <ul className={stiloAdmin.submenu}>
                            <li onClick={() => handleNavClick('ProductosFrom')}>Lista de Productos</li>
                            <li onClick={() => handleNavClick('CategoriaFrom')}>Categorías</li>
                        </ul>
                    )}

                    <li onClick={() => handleNavClick('Empleado')}>Empleados</li>
                    <li onClick={() => handleNavClick('Proyecto')}>Proyectos</li>
                    <li onClick={() => handleNavClick('ClienteFrom')}>Clientes</li>
                    <li onClick={() => handleNavClick('AdministradorFrom')}>Administradores</li>
                    <li onClick={() => handleNavClick('ImagenFrom')}>Imagenes</li>
                    <li onClick={() => handleNavClick('EstadoPedidoFrom')}>Estado Pedido</li>
                    <li onClick={() => handleNavClick('Pedido')}>Pedidos</li>
                    <li onClick={() => handleNavClick('Factura')}>Facturas</li>
                    <li onClick={() => handleNavClick('HistorialEstado')}>Historial Estado</li>
                    <li onClick={() => handleNavClick('DetallePedidoFrom')}>Detalle Pedido</li>
                    <li class={stiloAdmin.logout} onClick={logout}>Cerrar Sesión</li>
                </ul>
            </aside>

            <main className={stiloAdmin.dashboard}>
                {!activateComponent && (
                    <>
                        <h1>Panel de Control</h1>
                        <p>Bienvenido a tu panel de control.</p>
                        <div className={stiloAdmin.cards}>
                            <div className={stiloAdmin.card}> 
                                <p className={stiloAdmin.count}>{clientes?.length ?? 0}</p>
                                <p>Usuarios Registrados</p>
                            </div>
                            <div className={stiloAdmin.card}> 
                                <p className={stiloAdmin.count}>{pedidos?.length ?? 0}</p>
                                <p>Ventas Realizadas</p>
                            </div>
                            <div className={stiloAdmin.card}> 
                                <p className={stiloAdmin.count}>{tareasPendientes.length}</p>
                                <p>Tareas Pendientes</p>
                            </div>
                        </div>
                        <button className={stiloAdmin.btn_tienda} onClick={goToTienda}>Ver tu tienda</button>
                    </>
                )}

                {activateComponent === 'AdministradorFrom' && <AdministradorFrom />}
                {activateComponent === 'ClienteFrom' && <ClienteFrom />}
                {activateComponent === 'ImagenFrom' && <ImagenFrom />}
                {activateComponent === 'ProductosFrom' && <ProductosFrom />}
                {activateComponent === 'CategoriaFrom' && <CategoriaFrom />}
                {activateComponent === 'Empleado' && <Empleado />}
                {activateComponent === 'EstadoPedidoFrom' && <EstadoPedidoFrom />}
                {activateComponent === 'Proyecto' && <Proyecto />}
                {activateComponent === 'Pedido' && <Pedido />}
                {activateComponent === 'Factura' && <Factura />}
                {activateComponent === 'HistorialEstado' && <HistorialEstado />}
                {activateComponent === 'DetallePedidoFrom' && <DetallePedidoFrom />}
            </main>
        </div>
    )
}

export default Administrador
