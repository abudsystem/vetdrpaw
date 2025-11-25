import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Appointment } from "@/models/Appointment";
import { authMiddleware } from "@/middleware/auth.middleware";
import mongoose from "mongoose";

// Función utilitaria para validar ObjectId
function validateObjectId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("ID inválido");
  }
}

// get
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // <-- params es Promise
) {
  await connectDB();

  try {
    const user = await authMiddleware(req);
    if (!user)
      return NextResponse.json({ success: false, message: "No autorizado" }, { status: 401 });

    // Desestructuramos el id usando await
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "ID inválido" }, { status: 400 });
    }

    const appointment = await Appointment.findById(id)
      .populate("pet", "nombre especie edad raza")
      .populate("veterinarian", "name email");

    if (!appointment) {
      return NextResponse.json({ success: false, message: "Cita no encontrada" }, { status: 404 });
    }


    return NextResponse.json({ success: true, data: appointment });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}


// ---------------------- PUT ----------------------
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // ahora es Promise
) {
  await connectDB();
  try {
    const user = await authMiddleware(req);
    if (!user) return NextResponse.json({ success: false, message: "No autorizado" }, { status: 401 });

    const { id } = await params; // desestructuramos con await
    validateObjectId(id);

    const data = await req.json();
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return NextResponse.json({ success: false, message: "Cita no encontrada" }, { status: 404 });
    }


    appointment.date = data.date || appointment.date;
    appointment.reason = data.reason || appointment.reason;
    appointment.status = data.status || appointment.status;

    await appointment.save();
    const populated = await appointment.populate([
      { path: "pet", select: "nombre especie edad raza" },
      { path: "veterinarian", select: "name email" },
    ]);

    return NextResponse.json({ success: true, data: populated });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}


// ---------------------- DELETE ----------------------
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // también Promise
) {
  await connectDB();
  try {
    const user = await authMiddleware(req);
    if (!user) return NextResponse.json({ success: false, message: "No autorizado" }, { status: 401 });

    const { id } = await params; // desestructuramos con await
    validateObjectId(id);

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return NextResponse.json({ success: false, message: "Cita no encontrada" }, { status: 404 });
    }

    await appointment.deleteOne();
    return NextResponse.json({ success: true, message: "Cita eliminada correctamente" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
