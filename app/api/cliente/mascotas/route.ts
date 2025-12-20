import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Pet } from "@/models/Pet";
import { authMiddleware } from "@/middleware/auth.middleware";

export async function GET(req: Request) {
  await connectDB();

  const user = await authMiddleware(req);
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    let pets;

    // Si es un cliente, solo ver sus mascotas
    if (user.role === "cliente") {
      pets = await Pet.find({ propietario: user.id }).populate("propietario assignedVet");
    } else {
      // Veterinarios ven todas
      pets = await Pet.find().populate("propietario assignedVet");
    }

    return NextResponse.json(pets);
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

  const data = await req.json();

  const petData: any = {
    ...data,
    propietario: user.id
  };

  // Limpiar assignedVet si viene vacío
  if (petData.assignedVet && petData.assignedVet.trim() === "") {
    delete petData.assignedVet;
  }

  try {
    const newPet = await Pet.create(petData);
    return NextResponse.json(newPet, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
