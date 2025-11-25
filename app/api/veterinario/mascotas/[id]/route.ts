import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Pet } from "@/models/Pet";
import { authMiddleware } from "@/middleware/auth.middleware";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // params es un Promise
) {
  const unwrappedParams = await params; // desenvuelves el Promise
  const { id } = unwrappedParams;

  await connectDB();

  const user = await authMiddleware(req);
  if (!user || user.role !== "veterinario") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const pet = await Pet.findById(id);
  if (!pet) return NextResponse.json({ error: "No encontrada" }, { status: 404 });

  return NextResponse.json(pet);
}
