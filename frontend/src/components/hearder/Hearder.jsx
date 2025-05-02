import React, { useState } from "react";
import './hearder.css';
import logo from '../IMG/bradatecsrl.png';

const Header = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);

  const Dmenu = () => {
    setMostrarMenu(!mostrarMenu);
  };

  return (
    <header className="header">
      <img src={logo} alt="Brada_logo" className="logo" />

      <div className="search-box">
        <input type="text" placeholder="Search..." />
        <button>🔍</button>
      </div>

      <nav className="nav-iconos">
        <a href="#">Inicio 🏠</a>

        <div className="menu">
          <button onClick={Dmenu} className="btn-menu">Menú ☰</button>
          {mostrarMenu && (
            <div className="sub-menu">
              <a href="#">Categorías</a>
              <a href="#">Proyectos</a>
            </div>
          )}
        </div>

        <a href="#">Servicio 📞</a>
        <a href="#">Carrito 🛒</a>
      </nav>
    </header>
  );
};

export default Header;

