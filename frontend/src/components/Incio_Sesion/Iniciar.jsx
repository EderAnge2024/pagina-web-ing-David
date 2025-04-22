import React, { useState } from "react";
import '../Registro/registro.css'

const Iniciar = () => {
  const [form, setForm] = useState({ correo: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/clientes/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Bienvenido ${data.cliente.nombre}`);
        // Aquí puedes guardar en localStorage o redirigir
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error("Error al iniciar sesión", err);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="correo"
          placeholder="Correo"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
          required
        />
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

export default Iniciar;
