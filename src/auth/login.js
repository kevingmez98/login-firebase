// src/Login.js
import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { auth, provider, signInWithPopup } from "./firebase";
import { signOut } from "firebase/auth";
import GetAllCustomers from "../forms/AllCustomers"

const Login = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Manejar Login
  const handleLogin = async () => {
    console.log("haciendo login");
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      console.log("Token JWT de Firebase:", idToken);

      // Actualizar el estado del usuario
      setUser(result.user);

      // Enviar el token al backend para validación
      const response = await fetch("http://localhost:3000/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: idToken }),
      });

      if (response.ok) {
        console.log("Usuario autenticado exitosamente");

        //Colocar data
        const data = await response.json();
        const token = data.token;
        localStorage.setItem("token", token);

        // Decodificar el token para obtener el rol
        const decoded = jwtDecode(token);
        console.log(decoded);
        console.log("Token backend");
        console.log(token);
        console.log("Tipo de usuario:", decoded.tipoUsuario);
      } else {
        const errorData = await response.json(); // El servidor debe enviar un cuerpo en formato JSON
        setError("Error al autenticar el usuario. "+ errorData.error.message);
      }
    } catch (error) {
      console.error("Error en el login:", error);
    }
  };

  // Manejar Logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Cierra la sesión en Firebase

      // Obtén el token JWT del almacenamiento local
      const token = localStorage.getItem("token");

      // Elimina el token del almacenamiento local
      localStorage.removeItem("token");

      // Enviar el token al backend para validación
      const res = await fetch(
        `http://localhost:3000/usuarios/logout`, // Incluye el idUsuario en la ruta,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
            },
          }
        );


      console.log("Sesión cerrada exitosamente y token eliminado");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };


  return (
    <div>
      <h1>Login con Google</h1>
      {user ? (
        <div>
          {/* Muestra errores */}
          {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

          <p>Hola, {user.displayName}</p>
          <button onClick={handleLogout}>Cerrar sesión</button>

        </div>
      ) : (
        <button onClick={handleLogin}>Iniciar sesión con Google</button>
      )}
      <GetAllCustomers />
    </div>
  );
};

export default Login;
