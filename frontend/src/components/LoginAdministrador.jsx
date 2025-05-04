import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginAdministrador.css'

const LoginForm = () => {
    const [Usuario, setUsuario] = useState('');
    const [Contrasena, setContrasena] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Datos estáticos del administrador
    const adminUsuario = 'admin123';
    const adminContrasena = 'admin123';
    const adminNombre = 'Administrador Principal';

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validar datos estáticos
        if (Usuario === adminUsuario && Contrasena === adminContrasena) {
            setMensaje(`Bienvenido, ${adminNombre}`);
            setError(null);
            localStorage.setItem('authToken', 'token_estatico'); // Simula token
            navigate('/administrador');
        } else {
            setError('Usuario o contraseña incorrectos');
            setMensaje('');
        }
    };

    const handleCreateAccount = () => {
        navigate('/userform');
    };

    return (
        <div className="login-container">
            <div className="login-header">
                <h1>Bienvenido</h1>
                
            </div>

            <form onSubmit={handleSubmit} className="login-form">
                <input
                    type="text"
                    placeholder="Usuario"
                    value={Usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    className="input"
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={Contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    className="input"
                />
                <button type="submit" className="submit-button">
                    Iniciar sesión
                </button>
            </form>

            {mensaje && <div className="message success">{mensaje}</div>}
            {error && <div className="message error">{error}</div>}
        </div>
    );
};

export default LoginForm;
