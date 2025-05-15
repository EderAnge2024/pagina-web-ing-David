import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import stiloLogin from './LoginAdministrador.module.css'
import useAuthStore from '../store/AuthStore';

const LoginForm = () => {
    const [Usuario, setUsuario] = useState('');
    const [Contrasena, setContrasena] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuthStore();

    // Datos estáticos del administrador
    const adminUsuario = 'admin123';
    const adminContrasena = 'admin123';
    const adminNombre = 'Administrador Principal';

    const handleSubmit = (e) => {
    e.preventDefault();

    if (Usuario === adminUsuario && Contrasena === adminContrasena) {
        const userData = { nombre: adminNombre };
        const token = 'token_estatico';

        login(userData, token); // <-- aquí actualizas el estado global también

        setMensaje(`Bienvenido, ${adminNombre}`);
        setError(null);
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
        <div className={stiloLogin.login_container}>
            <div className={stiloLogin.login_header}>
                <h1>Bienvenido</h1>
                
            </div>

            <form onSubmit={handleSubmit} className={stiloLogin.login_form}>
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
                <button type="submit" className={stiloLogin.submit_button}>
                    Iniciar sesión
                </button>
            </form>

            {mensaje && <div className={stiloLogin.message_success}>{mensaje}</div>}
            {error && <div className={stiloLogin.messag_error}>{error}</div>}
        </div>
    );
};

export default LoginForm;
