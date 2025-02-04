import React, { useState } from "react";
import {jwtDecode} from "jwt-decode";

const FormularioGetCustomers = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita la recarga de la página
    // Obtén el token JWT del almacenamiento local
    const token = localStorage.getItem("token");

    if (!token) {
     setError("No estás autenticado. Por favor, inicia sesión.");
    return;
     }

    try {
      // Decodificar el token para obtener el id usuario
      const decoded = jwtDecode(token);
      let idUsuario = decoded.idUsuario;
      // Realiza la solicitud GET al backend
      const res = await fetch(
      // `http://localhost:3000/usuarios/customers`,
        
      `http://localhost:3000/usuarios/${idUsuario}/customer`, // Incluye el idUsuario en la ruta,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
          },
        }
      );

      if (!res.ok) {
        // Intenta leer el cuerpo de la respuesta como JSON

        const errorData = await res.json(); // El servidor debe enviar un cuerpo en formato JSON
        throw new Error(errorData.message || errorData.error.message || "Error al realizar la solicitud.");
      }

      const result = await res.json(); // Convierte la respuesta a JSON
      setResponse(result); // Guarda la respuesta en el estado
      setError(null); // Limpia errores
    } catch (err) {
      console.error("Error en la solicitud:", err.message);
      console.log(err);
      setError("Hubo un problema al conectar con el servidor. " + err);
      setResponse(null);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Formulario Get all customers</h1>
      <form onSubmit={handleSubmit}>
        <button type="submit" style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
          Enviar
        </button>
      </form>

      {/* Muestra errores */}
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

      {/* Muestra la respuesta del servidor */}
      {response && (
        <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "#f9f9f9", border: "1px solid #ddd" }}>
          <h3>Respuesta del servidor:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default FormularioGetCustomers;
