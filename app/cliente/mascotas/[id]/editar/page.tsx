"use client";
import { useEffect, useState } from "react";
import { getPetById, updatePet } from "@/services/cliente/pet.service";

export default function EditPet({ params }: any) {
  const [form, setForm] = useState<any>({
    nombre: "",
    especie: "",
    edad: "",
    raza: "",
  });
  const [token, setToken] = useState<string>("");
  const [id, setId] = useState<string>("");

  // 1️⃣ Cargar token y params solo en cliente
  useEffect(() => {
    const t = localStorage.getItem("token") || "";
    setToken(t);

    // params es una Promise, así que necesitamos resolverla
    (async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    })();
  }, [params]);

  // 2️⃣ Cargar datos de la mascota
  useEffect(() => {
    if (!token || !id) return;

    async function load() {
      const data = await getPetById(id, token);

      setForm({
        nombre: data.nombre || "",
        especie: data.especie || "",
        edad: data.edad?.toString() || "",
        raza: data.raza || "",
      });
    }

    load();
  }, [token, id]);

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!token) return;

    const payload = { ...form, edad: Number(form.edad) };
    await updatePet(id, payload, token);

    window.location.href = "/cliente/mascotas";
  }

  if (!form.nombre) return <div>Cargando...</div>;

  return (
    <div>
      <h1>Editar {form.nombre}</h1>
      <form onSubmit={handleSubmit}>
        <input name="nombre" value={form.nombre} onChange={handleChange} />
        <input name="especie" value={form.especie} onChange={handleChange} />
        <input name="edad" type="number" value={form.edad} onChange={handleChange} />
        <input name="raza" value={form.raza} onChange={handleChange} />
        <button type="submit">Actualizar</button>
      </form>
    </div>
  );
}
