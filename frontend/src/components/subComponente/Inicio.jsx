import useImagenStore from "../../store/ImagenStore";
import './inicio.css'; // Asegúrate de tener esta clase

const Inicio = () => {
    const { imagens } = useImagenStore();

    // Encuentra la imagen tipo "Banner"
    const bannerImg = imagens.find(img => img.Tipo_Imagen === "Banner");

    return (
        <div className="cuerpoBanner">
            <div
                className="inicio"
                style={{
                    backgroundImage: 
                    `linear-gradient(rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.3)),
                    url(${bannerImg?.URL})`,
                }}
            >
                <div className="baner">
                    <h1>Compra los mejores</h1>
                    <h1>productos</h1>
                    <h5>descubra la calidad de nuestros productos y los mejores servicios</h5>
                    <h4>"¡Compre ya!"</h4>
                </div>
            </div>  
            <div className="contenidoPro">
                <h5>Aquie el contenido de os productos</h5>
            </div>
        </div>  
    );
};

export default Inicio;
