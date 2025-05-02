import React from 'react';
import './Home.css';
import video1 from '../IMG/barca.mp4';


const Home = () => {
  const videos = [video1];  // Aquí agregas más videos si es necesario

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
                onMouseEnter={(e) => e.target.play()}   // Reproduce el video al pasar el mouse
                onMouseLeave={(e) => {e.target.pause();  // Pausa el video al quitar el mouse
                  e.target.currentTime = 0;   // Regresa el video a 0 al quitar el cursor
                }}  
                src={video}
              >
                Tu navegador no soporta la etiqueta de video.
              </video>
              <p>Producto y precio</p>
              <button>Agregar al carrito</button>
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


