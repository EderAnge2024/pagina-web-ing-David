import React, { useState, useEffect } from "react";
import './header.css';
import axios from 'axios';

const Header = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [logoURL, setLogoURL] = useState('');

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axios.get('http://localhost:3001/logo');
        console.log('Logo recibido:', response.data);  // Verifica la respuesta
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setLogoURL(response.data[0].URL_Logo);  // ← accede al primer elemento del array
        }
        
      } catch (error) {
        console.error('Error al obtener el logo:', error);
      }
    };
    fetchLogo();
  }, []);
  

  const Dmenu = () => {
    setMostrarMenu(!mostrarMenu);
  };

  const irInicio = () => {
    window.location.href = '/';
  };

  return (
    <header className="header">
      {logoURL && (
  <img 
    src={logoURL} 
    alt="Brada_logo" 
    className="logo" 
    onClick={irInicio} 
  />
)}


      <div className="search-box">
        <input type="text" placeholder="Search..." />
        <button>🔍</button>
      </div>

      <nav className="nav-iconos">
        <a href="/">Inicio 🏠</a>

        <div className="menu">
          <button onClick={Dmenu} className="btn-menu">Menú ☰</button>
          {mostrarMenu && (
            <div className="sub-menu">
              <a href="#">Categorías</a>
              <a href="/proyectoslista">Proyectos</a>
            </div>
          )}
        </div>

        <a href="/servicio">Servicio 📞</a>
        <a href="/carrito">Carrito 🛒</a>
      </nav>
    </header>
  );
};

export default Header;
