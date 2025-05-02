import React from "react";
import './hearder.css'
import logo from '../IMG/bradatecsrl.png';
import '../Home/Home'

const Header = () => {
    return (
        <header className="header">
            <img src={logo} alt="Brada_logo" className="logo" />

            <div className="search-box">
                <input type="text" placeholder="Search..." />
                <button>🔍</button>
            </div>

            <nav className="nav-iconos">
                <a href="#">Inicio 🏠</a>
                <a href="#">Menú ☰</a>
                <a href="#">Servicio 📞</a>
                <a href="#">Carrito 🛒</a>
            </nav>
        </header>
    );
};

export default Header;

