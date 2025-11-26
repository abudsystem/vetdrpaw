import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { authMiddleware } from "@/middleware/auth.middleware";

export async function GET(req: Request) {
    await connectDB();

    const user = await authMiddleware(req);
    if (!user || user.role !== "veterinario") {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    try {
        const profile = await User.findById(user.id).select("-password").lean();
        if (!profile) {
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
        }
        return NextResponse.json(profile);
    } catch (error: any) {
        console.error("Error al obtener perfil:", error);
        return NextResponse.json({ error: "Error al obtener perfil" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    await connectDB();

    const user = await authMiddleware(req);
    if (!user || user.role !== "veterinario") {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    let data;
    try {
        data = await req.json();
    } catch (err) {
        return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
    }

    const { name, telefono, direccion, email } = data;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            user.id,
            { name, telefono, direccion, email },
            { new: true, runValidators: true }
        ).select("-password");

        return NextResponse.json(updatedUser);
    } catch (error: any) {
        console.error("Error al actualizar perfil:", error);
        return NextResponse.json({ error: "Error al actualizar perfil" }, { status: 500 });
    }
}
