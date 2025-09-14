import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/AuthStore';
import styles from './LoginAdministrador.module.css';

const LoginForm = () => {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [recuperar, setRecuperar] = useState(false); // Estado para mostrar recuperación
    const [codigo, setCodigo] = useState('');
    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [etapa, setEtapa] = useState(1); // 1: pedir usuario, 2: pedir código y nueva contraseña
    const [email, setEmail] = useState(''); // Nuevo estado para email
    const navigate = useNavigate();
    
    // ✅ Obtener la función login del store
    const { login } = useAuthStore();
        
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
    
        try {
            const response = await fetch('http://localhost:3001/administrador/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Usuario: usuario, Contrasena: contrasena }),
            });
    
            const data = await response.json();
    
            if (!response.ok) throw new Error(data.mensaje || 'Error desconocido');
    
            login(data.admin, data.token); // Guardar en store o contexto
            setMensaje(`Bienvenido, ${data.admin.Nombre_Administrador}`);
            setError(null);
    
            setTimeout(() => {
                navigate('/administrador');
            }, 1500);
    
        } catch (err) {
            setError(err.message);
            setMensaje('');
        }
    
        setIsLoading(false);
    };

    // --- Recuperación de contraseña por correo ---
    const handleRecuperar = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMensaje('');
        try {
            const response = await fetch('http://localhost:3001/administrador/recuperar-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Error al solicitar código');
            setMensaje('Código enviado por correo electrónico');
            setEtapa(2);
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    };

    const handleVerificarCodigo = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMensaje('');
        try {
            const response = await fetch('http://localhost:3001/administrador/recuperar-email/verificar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, codigo, nuevaContrasena }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Error al verificar código');
            setMensaje('Contraseña actualizada correctamente');
            setTimeout(() => {
                setRecuperar(false);
                setEtapa(1);
                setUsuario('');
                setContrasena('');
                setCodigo('');
                setNuevaContrasena('');
                setEmail('');
                setMensaje('');
            }, 2000);
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
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
        <div className={styles.login}>
            <div className={styles.login__container}>
                <div className={styles.login__header}>
                    <div className={styles.login__icon}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9C15 12.8 12.8 15 9 15C5.2 15 3 12.8 3 9V7L9 7.5V9C9 10.7 10.3 12 12 12C13.7 12 15 10.7 15 9Z" fill="currentColor"/>
                        </svg>
                    </div>
                    <h1 className={styles.login__title}>Bienvenido</h1>
                    <p className={styles.login__subtitle}>Ingresa tus credenciales para continuar</p>
                </div>
                {!recuperar ? (
                    <form onSubmit={handleSubmit} className={styles.login__form}>
                        <div className={styles.login__field}>
                            <label className={styles.login__label} htmlFor="usuario">
                                Usuario
                            </label>
                            <input
                                id="usuario"
                                type="text"
                                placeholder="Ingresa tu usuario"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                className={`${styles.login__input} ${error ? styles['login__input--error'] : ''}`}
                                required
                            />
                        </div>
                        <div className={styles.login__field}>
                            <label className={styles.login__label} htmlFor="contrasena">
                                Contraseña
                            </label>
                            <div className={styles.login__password_wrapper}>
                                <input
                                    id="contrasena"
                                    type={mostrarContrasena ? "text" : "password"}
                                    placeholder="Ingresa tu contraseña"
                                    value={contrasena}
                                    onChange={(e) => setContrasena(e.target.value)}
                                    className={`${styles.login__input} ${error ? styles['login__input--error'] : ''}`}
                                    required
                                />
                                <button 
                                    type="button"
                                    className={styles.login__password_toggle}
                                    onClick={() => setMostrarContrasena(!mostrarContrasena)}
                                    aria-label={mostrarContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {mostrarContrasena ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                            <button type="button" style={{ color: '#6C63FF', fontSize: '0.95rem', textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }} onClick={() => setRecuperar(true)}>
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>
                        <button 
                            type="submit" 
                            className={`${styles.login__button} ${isLoading ? styles['login__button--loading'] : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className={styles.login__spinner}></span>
                                    <span>Iniciando sesión...</span>
                                </>
                            ) : (
                                <span>Iniciar sesión</span>
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={etapa === 1 ? handleRecuperar : handleVerificarCodigo} className={styles.login__form}>
                        {etapa === 1 ? (
                            <>
                                <div className={styles.login__field}>
                                    <label className={styles.login__label} htmlFor="email">
                                        Correo electrónico
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Ingresa tu correo"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`${styles.login__input} ${error ? styles['login__input--error'] : ''}`}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className={`${styles.login__button} ${isLoading ? styles['login__button--loading'] : ''}`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className={styles.login__spinner}></span>
                                            <span>Enviando código...</span>
                                        </>
                                    ) : (
                                        <span>Enviar código</span>
                                    )}
                                </button>
                            </>
                        ) : (
                            <>
                                <div className={styles.login__field}>
                                    <label className={styles.login__label} htmlFor="codigo">
                                        Código recibido
                                    </label>
                                    <input
                                        id="codigo"
                                        type="text"
                                        placeholder="Ingresa el código"
                                        value={codigo}
                                        onChange={(e) => setCodigo(e.target.value)}
                                        className={`${styles.login__input} ${error ? styles['login__input--error'] : ''}`}
                                        required
                                    />
                                </div>
                                <div className={styles.login__field}>
                                    <label className={styles.login__label} htmlFor="nuevaContrasena">
                                        Nueva contraseña
                                    </label>
                                    <input
                                        id="nuevaContrasena"
                                        type="password"
                                        placeholder="Nueva contraseña"
                                        value={nuevaContrasena}
                                        onChange={(e) => setNuevaContrasena(e.target.value)}
                                        className={`${styles.login__input} ${error ? styles['login__input--error'] : ''}`}
                                        minLength={8}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className={`${styles.login__button} ${isLoading ? styles['login__button--loading'] : ''}`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className={styles.login__spinner}></span>
                                            <span>Verificando...</span>
                                        </>
                                    ) : (
                                        <span>Restablecer contraseña</span>
                                    )}
                                </button>
                            </>
                        )}
                    </form>
                )}
                
                {mensaje && (
                    <div className={`${styles.login__message} ${styles['login__message--success']}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {mensaje}
                    </div>
                )}
                {error && (
                    <div className={`${styles.login__message} ${styles['login__message--error']}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginForm;