import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Pet } from "@/models/Pet";
import { authMiddleware } from "@/middleware/auth.middleware";

// =========================
// GET MASCOTA POR ID
// =========================
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const user = await authMiddleware(req);
  if (!user)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await context.params;

  try {
    const pet = await Pet.findById(id).populate("propietario assignedVet");

    if (!pet)
      return NextResponse.json({ error: "Mascota no encontrada" }, { status: 404 });

    return NextResponse.json(pet);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// =========================
// EDITAR MASCOTA
// =========================
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const user = await authMiddleware(req);
  if (!user)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await context.params;

  try {
    const body = await req.json();

    const mascotaActualizada = await Pet.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!mascotaActualizada) {
      return NextResponse.json(
        { error: "Mascota no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(mascotaActualizada, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al actualizar" },
      { status: 500 }
    );
  }
}


// =========================
// ELIMINAR MASCOTA
// =========================
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const user = await authMiddleware(req);
  if (!user)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await context.params;

  try {
    const deleted = await Pet.findOneAndDelete({
      _id: id,
      propietario: user.id,
    });

    if (!deleted)
      return NextResponse.json(
        { error: "No puedes eliminar esta mascota" },
        { status: 403 }
      );

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
