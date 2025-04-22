import React from "react";
import "./interfaz1.css";

const Interfaz1 = () => {
  return (
    <div className="wrapper">
      {/*----------------------- Encabezado -----------------------*/}
      <header className="header">
        <div className="logo-text">
          <h2>BRADATEC SRL</h2>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Buscar productos..." />
          <button>🔍</button>
        </div>
        <nav className="nav-icons">
          <span>🏠 Inicio</span>
          <span>🧭 Menú</span>
          <span>🛎️ Servicio</span>
          <span>👤 Usuario</span>
          <span>🛒 Carrito</span>
        </nav>
      </header>

      {/*---------------------------- Título y descripción -------------------------*/}
      <section className="hero">
        <h1>Compra los mejores productos</h1>
        <p>
          Descubra la calidad de nuestros productos y los mejores servicios <br />
          <span className="sub">“Compre ya”</span>
        </p>
      </section>

      {/*------------------- Productos ---------------------------*/}
      <section className="productos">
        <h2>Productos más vendidos</h2>
        <div className="productos-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div className="producto" key={i}>
              <div className="img-placeholder">img</div>
              <p>Producto {i + 1} <br /> S/ 00.00</p>
              <button className="btn">Añadir al carrito</button>
            </div>
          ))}
        </div>
      </section>

      {/*------------- Footer -------------------------*/}
      <footer className="footer">
        <div>
          <strong>Teléfonos:</strong> <br /> 123-456-789 <br />
          <strong>Email:</strong> <br /> contacto@bradatec.com
        </div>
        <div>
          <strong>Dirección:</strong> <br /> Calle Ejemplo 123, Ciudad <br />
          <strong>Servicios:</strong> <br /> Ventas y Soporte Técnico
        </div>
      </footer>
    </div>
  );
};

export default Interfaz1;
