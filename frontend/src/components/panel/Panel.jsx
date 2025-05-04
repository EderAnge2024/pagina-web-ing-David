import React, {useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import {IoMdOpen} from "react-icons/io";
import './panel.css'

const Panel = ()=>{
    const navigate = useNavigate();
    const handleLogout = () =>{
        localStorage.removeItem('usuario')
        sessionStorage.clear();
        navigate('/login');
    };
    return (
        <div className="principal panel">
            <main>
                <h5 className='title-page'>PANEL DE CONTROL</h5>

                <div>
                    <Link to='/productos'>
                        <IoMdOpen className='ico' />
                        <p>PRODUCTOS</p>
                        <button>INGRESAR</button>
                    </Link>
                    <Link to='/empleados'>
                        <IoMdOpen className='ico' />
                        <p>EMPLEADOS</p>
                        <button>INGRESAR</button>
                    </Link>
                    <Link to='/categorias'>
                        <IoMdOpen className='ico' />
                        <p>CATEGORIAS</p>
                        <button>INGRESAR</button>
                    </Link>
                    <Link to='/proyectos'>
                        <IoMdOpen className='ico' />
                        <p>PROYECTOS</p>
                        <button>INGRESAR</button>
                    </Link>
                    <Link to='/empleadoslista'>
                        <IoMdOpen className='ico' />
                        <p>LISTA DE EMPLEADOS</p>
                        <button>INGRESAR</button>
                    </Link>
                    <Link to='/productoslistas'>
                        <IoMdOpen className='ico' />
                        <p>LISTA DE PRODUCTOS</p>
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

export default Panel