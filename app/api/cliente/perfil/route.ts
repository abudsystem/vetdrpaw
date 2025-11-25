import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Pet } from "@/models/Pet";
import { authMiddleware } from "@/middleware/auth.middleware";

export async function GET(req: Request, { params }: any) {
  await connectDB();

  const user = await authMiddleware(req);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const pet = await Pet.findById(params.id).populate("propietario assignedVet");

    if (!pet) {
      return NextResponse.json({ error: "Mascota no encontrada" }, { status: 404 });
    }

    // Seguridad: El cliente solo puede ver sus mascotas
    if (user.role === "cliente" && pet.propietario._id.toString() !== user.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    return NextResponse.json(pet);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await connectDB();

  const user = await authMiddleware(req);
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { nombre, especie, edad, raza, assignedVet } = await req.json();

  if (!nombre || !especie || !edad || !raza || !assignedVet) {
    return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
  }

  try {
    const pet = await Pet.create({
      nombre,
      especie,
      edad,
      raza,
      propietario: user.id,
      assignedVet,
    });

    return NextResponse.json(pet, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
