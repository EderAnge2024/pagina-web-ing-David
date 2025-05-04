import React, { useEffect } from 'react';
import './panel.css';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdOpen } from "react-icons/io";

const Panel = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Aquí puedes limpiar almacenamiento si estás usando uno:
        localStorage.removeItem('usuario'); // Ejemplo
        sessionStorage.clear(); // Si usas sessionStorage
        // Redirige al login
        navigate('/');
    };

    return (
        <div className="principal panel">
            <main>
                <h5 className='title-page'>PANEL DE CONTROL</h5>

                <div>
                    <Link to='/productos'>
                        <IoMdOpen className='ico' />
                        <p>AGREGAR PRODUCTOS</p>
                        <button>INGRESAR</button>
                    </Link>
                    <Link to='/productoslistas'>
                        <IoMdOpen className='ico' />
                        <p>MODIFICAR PRODUCTO</p>
                        <button>INGRESAR</button>
                    </Link>
                    <Link to='/empleados'>
                        <IoMdOpen className='ico' />
                        <p>AGREGAR EMPLEADOS</p>
                        <button>INGRESAR</button>
                    </Link>
                    <Link to='/empleadoslista'>
                        <IoMdOpen className='ico' />
                        <p>MODIFICAR EMPLEADOS</p>
                        <button>INGRESAR</button>
                    </Link>
                    <Link to='/categorias'>
                        <IoMdOpen className='ico' />
                        <p>AGREGAR CATEGORIAS</p>
                        <button>INGRESAR</button>
                    </Link>
                    <Link to='/proyectos'>
                        <IoMdOpen className='ico' />
                        <p>AGREGAR PROYECTOS</p>
                        <button>INGRESAR</button>
                    </Link>
                    <Link to='/proyectoslista'>
                        <IoMdOpen className='ico' />
                        <p>MODIFICAR PROYECTO</p>
                        <button>INGRESAR</button>
                    </Link>
                    <Link to='/imagenes'>
                        <IoMdOpen className='ico' />
                        <p>AGREGAR BANNER</p>
                        <button>INGRESAR</button>
                    </Link>
                    <Link to='/imagenenlista'>
                        <IoMdOpen className='ico' />
                        <p>MODIFICAR BANNER</p>
                        <button>INGRESAR</button>
                    </Link>
                    <Link to='/logos'>
                        <IoMdOpen className='ico' />
                        <p>AGREGAR LOGO</p>
                        <button>INGRESAR</button>
                    </Link>
                    <Link to='/logoslista'>
                        <IoMdOpen className='ico' />
                        <p>MODIFICAR LOGO</p>
                        <button>INGRESAR</button>
                    </Link>
                </div>

                <div className="logout-container">
                    <button className="logout-button" onClick={handleLogout}>
                        CERRAR SESIÓN
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Panel;
