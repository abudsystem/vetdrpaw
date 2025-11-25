import { InventoryController } from "@/controllers/inventory.controller";
import { authMiddleware } from "@/middleware/auth.middleware";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";

export async function POST(req: Request) {
    await connectDB();
    const user = await authMiddleware(req);
    if (!user || user.role !== "administrador") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Inject userId into body for the controller
    const body = await req.json();
    const reqWithUser = new Request(req.url, {
        method: req.method,
        headers: req.headers,
        body: JSON.stringify({ ...body, userId: user.id }),
    });

    return InventoryController.registerMovement(reqWithUser);
}
