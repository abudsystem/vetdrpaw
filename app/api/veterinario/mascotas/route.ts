// /app/api/veterinario/mascotas/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Pet } from "@/models/Pet";
import { authMiddleware } from "@/middleware/auth.middleware";
import { User } from "@/models/User";

export async function GET(req: Request) {
  await connectDB();

  const user = await authMiddleware(req);
  if (!user || user.role !== "veterinario") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const pets = await Pet.find()
      .populate({ path: "propietario", select: "name email" })
      .populate({ path: "assignedVet", select: "name email" })
      .lean();


    return NextResponse.json(pets);
  } catch (error: any) {
    console.error("Error al obtener mascotas:", error);
    return NextResponse.json({ error: "Error al obtener mascotas" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  await connectDB();

  const user = await authMiddleware(req);
  if (!user || user.role !== "veterinario") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let data;
  try {
    data = await req.json();
  } catch (err) {
    return NextResponse.json({ error: "JSON inválido o mal formado" }, { status: 400 });
  }

  const { nombre, especie, raza, edad, propietario } = data;
  if (!nombre || !especie || !raza || !edad || !propietario) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  try {
    const pet = await Pet.create({
      ...data,
      assignedVet: user.id, // veterinario logueado
    });

    return NextResponse.json(pet, { status: 201 });
  } catch (error: any) {
    console.error("Error al crear mascota:", error.message);
    return NextResponse.json({ error: "Error al crear mascota" }, { status: 500 });
  }
}
