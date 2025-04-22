import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./inicio.css";


const Interfaz = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(!menuVisible);
  const navigate = useNavigate();

  const irARegistro = () => {
    navigate("/registro");
};
  const irAiniciar = () => {
    navigate("/iniciar");
};


  return (
    <div className="cassiopeia-wrapper">
      {/*----------------------- Encabezado ----------------------*/}
      <header className="cassio-header">
        <div className="logo">CASSIOPEIA</div>
        <div className="header-actions">
          <div className="language-selector">
            ES <span className="arrow">▼</span>
          </div>
          <div className="user-menu">
            <div className="user-icon" onClick={toggleMenu}>👤</div>
            {menuVisible && (
              <div className="dropdown-menu">
                <button onClick={irAiniciar}>Iniciar sesión</button>
                <button onClick={irARegistro}>Registrarse</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/*-----------------Eso ps xd----------------------------------- */}
      <div className="cassio-container">
        <div className="cassio-left">
          <h1>Bienvenido a "CASSIOPEIA"</h1>
          <p>
            Disfruta de las novedosas ofertas de nuestros productos colocados en nuestrio
            sitio web <strong>" descuentos increibles "</strong>. Disfruta ahora,
            Devilery y Pago en persona.
          </p>
          <button className="btn white" onClick={irARegistro}>¿Eres Cliente CASSIPEIA? Registrate</button>
          <div className="divider">
            <hr />
            <span>o</span>
            <hr />
          </div>
          <button className="btn blue">Ingresa y Disfruta de las novedades en nuestros Productos</button>
        </div>
        <div className="prime-right">
          <div className="content-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <div className="content-box" key={i}>IMG</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interfaz;
