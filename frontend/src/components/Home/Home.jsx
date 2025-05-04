import React from 'react';
import './Home.css';
import video1 from '../IMG/barca.mp4';
import { Link } from 'react-router-dom';

const Home = () => {
  const videos = [video1];

  return (
    <div className="layout">
      <main className="home">
        <section className="hero">
          <h1>Compra los mejores productos</h1>
          <p>Descubre la calidad de nuestros productos y los mejores servicios</p>
          <span>“Compre ya”</span>
        </section>

        <section className="productos">
          <h2>Productos más vendidos</h2>
          <div className="producto-grid">
            {videos.map((video, i) => (
              <div className="producto-card" key={i}>
                <video
                  className="producto-video"
                  muted
                  loop
                  onMouseEnter={(e) => e.target.play()}
                  onMouseLeave={(e) => {
                    e.target.pause();
                    e.target.currentTime = 0;
                  }}
                  src={video}
                />
                <p>Producto</p>
                <p>Precio</p>
                <button className="btn-agregar">Agregar al carrito</button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="gg">
          <p>Teléfonos : 973836976</p>
          <p>Email : bradatec@gmail.com</p>
        </div>
        <div className="hh">
          <p>Dirección : Av. Que te importa</p>
          <p>Servicios : 57525-8625</p>
        </div>
        <div className="adm">
        <Link to="/Login">Admin</Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;



