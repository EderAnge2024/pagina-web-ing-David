import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/AuthStore';
import styles from './LoginAdministrador.module.css';

const LoginForm = () => {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const login = useAuthStore(state => state.login);
    
    // Datos estáticos del administrador
    const adminUsuario = 'admin123';
    const adminContrasena = 'admin123';
    const adminNombre = 'Administrador Principal';
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulamos una verificación con un retraso para mostrar el efecto de carga
        setTimeout(() => {
            // Validar datos estáticos
            if (usuario === adminUsuario && contrasena === adminContrasena) {
                // Crear un objeto con la información del usuario
                const userData = {
                    nombre: adminNombre,
                    usuario: adminUsuario,
                    rol: 'admin'
                };
                
                // Generar un token simple (en producción usarías JWT u otro método seguro)
                const token = btoa(usuario + ':' + Date.now());
                
                // Llamar a la función login del store
                login(userData, token);
                
                setMensaje(`Bienvenido, ${adminNombre}`);
                setError(null);
                
                // Retrasamos la redirección para mostrar el mensaje
                setTimeout(() => {
                    // Redirigir al panel de administración
                    navigate('/administrador');
                }, 1500);
            } else {
                setError('Usuario o contraseña incorrectos');
                setMensaje('');
            }
            setIsLoading(false);
        }, 800);
    };
    
    // Efecto para limpiar mensajes después de un tiempo
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    return (
        <div className={styles.contenedor_general_login}>
            <div className={styles.login_container}>
                <div className={styles.login_header}>
                    <h1>Bienvenido</h1>
                </div>
                <form onSubmit={handleSubmit} className={styles.login_form}>
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        className={styles.login_input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        className={styles.login_input}
                        required
                    />
                    <button 
                        type="submit" 
                        className={styles.submit_button}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </button>
                </form>
                {mensaje && <div className={styles.message_success}>{mensaje}</div>}
                {error && <div className={styles.message_error}>{error}</div>}
            </div>
        </div>
    );  
};

export default LoginForm;