"use client";

import { useState, useEffect } from "react";
import { createPet } from "@/services/cliente/pet.service";

export default function NuevaMascota() {
  const [form, setForm] = useState({
    nombre: "",
    especie: "",
    edad: "",
    raza: "",
  });

  const [token, setToken] = useState("");

  // ✅ Solo se ejecuta en el navegador (fix SSR build)
  useEffect(() => {
    const t = localStorage.getItem("token") || "";
    setToken(t);
  }, []);

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (!token) {
      alert("No hay token. Inicia sesión primero.");
      return;
    }

    await createPet(
      { ...form, edad: Number(form.edad) },
      token
    );

    window.location.href = "/cliente/mascotas";
  }

  return (
    <div>
      <h1>Nueva Mascota</h1>

      <form onSubmit={handleSubmit}>
        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" />
        <input name="especie" value={form.especie} onChange={handleChange} placeholder="Especie" />
        <input name="edad" value={form.edad} onChange={handleChange} placeholder="Edad" />
        <input name="raza" value={form.raza} onChange={handleChange} placeholder="Raza" />

        <button type="submit">Guardar</button>
      </form>
    </div>
  );
}
