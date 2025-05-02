import React from 'react';
import './Home.css';
import video1 from '../IMG/barca.mp4';

const Home = () => {
  const videos = [video1]; // Agrega más videos si es necesario

  return (
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

      <footer className="footer">
        <div className="gg">
          <p>Teléfonos :</p>
          <p>Email :</p>
        </div>
        <div className="hh">
          <p>Dirección :</p>
          <p>Servicios :</p>
        </div>
      </footer>
    </main>
  );
};

export default Home;



