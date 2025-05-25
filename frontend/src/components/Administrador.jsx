import { useState } from "react";
import { useNavigate } from "react-router-dom";  // Importar hook para navegación
import styles from "./administrador.module.css";
import { 
  FaUserShield, FaUsers, FaImage, FaBoxOpen, FaListAlt, FaUserTie, 
  FaTruck, FaProjectDiagram, FaClipboardList, FaFileInvoice, 
  FaHistory, FaFileAlt, FaSignOutAlt, FaChevronDown, FaChevronUp, FaExternalLinkAlt 
} from "react-icons/fa";

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

import useAuthStore from "../store/AuthStore";

const Administrador = () => {
  const [activeComponent, setActiveComponent] = useState("AdministradorFrom");
  const [categoriaOpen, setCategoriaOpen] = useState(false);
  const { logout } = useAuthStore();
  const navigate = useNavigate();  // Hook para navegar programáticamente

  const handleLogout = () => {
    logout();
    navigate("/login");  
  };

  const titles = {
    AdministradorFrom: "Administradores",
    ClienteFrom: "Clientes",
    ImagenFrom: "Imágenes B,L",
    ProductosFrom: "Productos",
    CategoriaFrom: "Categorías",
    Empleado: "Empleados",
    EstadoPedidoFrom: "Estados Pedido",
    Proyecto: "Proyectos",
    Pedido: "Pedidos",
    Factura: "Facturas",
    HistorialEstado: "Historial Estados",
    DetallePedidoFrom: "Detalle Pedido",
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "AdministradorFrom": return <AdministradorFrom />;
      case "ClienteFrom": return <ClienteFrom />;
      case "ImagenFrom": return <ImagenFrom />;
      case "ProductosFrom": return <ProductosFrom />;
      case "CategoriaFrom": return <CategoriaFrom />;
      case "Empleado": return <Empleado />;
      case "EstadoPedidoFrom": return <EstadoPedidoFrom />;
      case "Proyecto": return <Proyecto />;
      case "Pedido": return <Pedido />;
      case "Factura": return <Factura />;
      case "HistorialEstado": return <HistorialEstado />;
      case "DetallePedidoFrom": return <DetallePedidoFrom />;
      default: return null;
    }
  };

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>BradaTec Admin</h2>
        <nav className={styles.navMenu}>
          <button onClick={() => { setActiveComponent("AdministradorFrom"); setCategoriaOpen(false); }}>
            <FaUserShield /> Administradores
          </button>
          <button onClick={() => { setActiveComponent("ClienteFrom"); setCategoriaOpen(false); }}>
            <FaUsers /> Clientes
          </button>
          <button onClick={() => { setActiveComponent("ImagenFrom"); setCategoriaOpen(false); }}>
            <FaImage /> Imágenes B,L
          </button>

          <div>
            <button 
              className={styles.dropdownToggle} 
              onClick={() => setCategoriaOpen(!categoriaOpen)}
              aria-expanded={categoriaOpen}
              aria-controls="submenu-categorias"
            >
              <FaListAlt /> Categorías {categoriaOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {categoriaOpen && (
              <div id="submenu-categorias" className={styles.submenu}>
                <button 
                  className={styles.submenuItem} 
                  onClick={() => { setActiveComponent("CategoriaFrom"); setCategoriaOpen(false); }}
                >
                  Agregar Categorías
                </button>
                <button 
                  className={styles.submenuItem} 
                  onClick={() => { setActiveComponent("ProductosFrom"); setCategoriaOpen(false); }}
                >
                  Productos
                </button>
              </div>
            )}
          </div>

          <button onClick={() => { setActiveComponent("Empleado"); setCategoriaOpen(false); }}>
            <FaUserTie /> Empleados
          </button>
          <button onClick={() => { setActiveComponent("EstadoPedidoFrom"); setCategoriaOpen(false); }}>
            <FaTruck /> Estados Pedido
          </button>
          <button onClick={() => { setActiveComponent("Proyecto"); setCategoriaOpen(false); }}>
            <FaProjectDiagram /> Proyectos
          </button>
          <button onClick={() => { setActiveComponent("Pedido"); setCategoriaOpen(false); }}>
            <FaClipboardList /> Pedidos
          </button>
          <button onClick={() => { setActiveComponent("Factura"); setCategoriaOpen(false); }}>
            <FaFileInvoice /> Facturas
          </button>
          <button onClick={() => { setActiveComponent("HistorialEstado"); setCategoriaOpen(false); }}>
            <FaHistory /> Historial Estados
          </button>
          <button onClick={() => { setActiveComponent("DetallePedidoFrom"); setCategoriaOpen(false); }}>
            <FaFileAlt /> Detalle Pedido
          </button>
        </nav>
      </aside>

      <div className={styles.mainSection}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.panelPrincipalLink}
              aria-label="Abrir Panel principal en nueva pestaña"
            >
              Panel principal <FaExternalLinkAlt className={styles.externalIcon} />
            </a>
          </div>
          <h1>{titles[activeComponent] || "Panel de Administración"}</h1>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <FaSignOutAlt /> Cerrar sesión
          </button>
        </header>

        <main className={styles.mainContent}>
          {renderComponent()}
        </main>
      </div>
    </div>
  );
};

export default Administrador;


