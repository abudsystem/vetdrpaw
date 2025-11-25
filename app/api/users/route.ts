import { UserController } from "@/controllers/user.controller";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/auth.middleware";

export async function GET(req: Request) {
    const user = await authMiddleware(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Allow administrador and Vets to list users
    if (user.role === "administrador" || user.role === "veterinario") {
        return UserController.list(req);
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function PUT(req: Request) {
    const user = await authMiddleware(req);
    if (!user || user.role !== "administrador") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return UserController.update(req);
}

export async function DELETE(req: Request) {
    const user = await authMiddleware(req);
    if (!user || user.role !== "administrador") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return UserController.delete(req);
}
