"use client";

import { useEffect, useState } from "react";
import { getPetById } from "@/services/cliente/pet.service";

export default function PetDetails({ params }: any) {
  const [pet, setPet] = useState<any>(null);
  const [token, setToken] = useState<string>("");
  const [id, setId] = useState<string>("");

  // 1️⃣ Resolver params y token solo en cliente
  useEffect(() => {
    const t = localStorage.getItem("token") || "";
    setToken(t);

    (async () => {
      const resolvedParams = await params; // params es Promise
      setId(resolvedParams.id);
    })();
  }, [params]);

  // 2️⃣ Cargar detalles de la mascota cuando tengamos token e id
  useEffect(() => {
    if (!token || !id) return;

    async function fetchPet() {
      const data = await getPetById(id, token);
      setPet(data);
    }

    fetchPet();
  }, [token, id]);

  if (!pet) return <div>Cargando...</div>;

  return (
    <div>
      <h1>Detalles de {pet.nombre}</h1>

      <p>🐾 Especie: {pet.especie}</p>
      <p>🎂 Edad: {pet.edad}</p>
      <p>🏷 Raza: {pet.raza}</p>

      <a href={`/cliente/mascotas/${pet._id}/editar`}>Editar</a>
    </div>
  );
}
