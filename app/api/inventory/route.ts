import { InventoryController } from "@/controllers/inventory.controller";
import { authMiddleware } from "@/middleware/auth.middleware";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";

export async function GET(req: Request) {
    await connectDB();
    const user = await authMiddleware(req);
    if (!user || (user.role !== "administrador" && user.role !== "veterinario")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return InventoryController.list(req);
}

export async function POST(req: Request) {
    await connectDB();
    const user = await authMiddleware(req);
    if (!user || (user.role !== "administrador" && user.role !== "veterinario")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return InventoryController.create(req);
}

export async function PUT(req: Request) {
    await connectDB();
    const user = await authMiddleware(req);
    if (!user || (user.role !== "administrador" && user.role !== "veterinario")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return InventoryController.update(req);
}

export async function DELETE(req: Request) {
    await connectDB();
    const user = await authMiddleware(req);
    if (!user || (user.role !== "administrador" && user.role !== "veterinario")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return InventoryController.delete(req);
}
