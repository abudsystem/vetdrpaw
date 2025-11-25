import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Appointment } from "@/models/Appointment";
import { Pet } from "@/models/Pet";
import { authMiddleware } from "@/middleware/auth.middleware";
import mongoose from "mongoose";

// ========================
// LISTAR CITAS DEL CLIENTE (PRUEBA)
// ========================
export async function GET(req: Request) {
  await connectDB();

  const user = await authMiddleware(req);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (user.role !== "cliente") {
    return NextResponse.json({ error: "Solo clientes pueden listar sus citas" }, { status: 403 });
  }

  try {
    // 🔹 Aquí no filtramos por propietario de la mascota, solo tomamos todas las citas
    const appointments = await Appointment.find()
      .populate({ path: "pet", select: "nombre especie edad raza propietario" })
      .populate({ path: "veterinarian", select: "name email" })
      .sort({ date: -1 });

    return NextResponse.json(appointments, { status: 200 });
  } catch (error: any) {
    console.error("Error al listar citas:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ========================
// CREAR NUEVA CITA
// ========================
export async function POST(req: Request) {
  await connectDB();

  const user = await authMiddleware(req);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (user.role !== "cliente") {
    return NextResponse.json({ error: "Solo clientes pueden crear citas" }, { status: 403 });
  }

  const data = await req.json();

  if (!data.pet || !data.veterinarian || !data.date || !data.reason) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  try {
    // Convertir IDs a ObjectId
    const petId = new mongoose.Types.ObjectId(data.pet);
    const vetId = new mongoose.Types.ObjectId(data.veterinarian);

    // Crear cita
    const newAppointment = await Appointment.create({
      pet: petId,
      veterinarian: vetId,
      date: data.date,
      reason: data.reason,
      status: "pendiente",
    });

    // Poblar referencias
    const populated = await newAppointment.populate([
      { path: "pet", select: "nombre especie edad raza propietario" },
      { path: "veterinarian", select: "name email" },
    ]);

    return NextResponse.json(populated, { status: 201 });
  } catch (error: any) {
    console.error("Error al crear cita:", error.message);
    if (error.name === "CastError") {
      return NextResponse.json({ error: "IDs de pet o veterinarian inválidos" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
