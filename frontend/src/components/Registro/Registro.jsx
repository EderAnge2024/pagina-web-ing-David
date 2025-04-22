import React, { useState } from "react";
import "./registro.css";

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await fetch("http://localhost:3001/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (respuesta.ok) {
        alert("¡Registro exitoso!");
      } else {
        const error = await respuesta.json();
        alert("Error al registrar: " + error.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de red.");
    }
  };

  return (
    <div className="registro-container">
      <h2>Registro Cassiopeia</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} required />
        <input type="text" name="apellido" placeholder="Apellido" onChange={handleChange} required />
        <input type="text" name="telefono" placeholder="Teléfono" onChange={handleChange} required />
        <input type="text" name="direccion" placeholder="Dirección" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default Registro;


