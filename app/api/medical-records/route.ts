import { MedicalRecordController } from "@/controllers/medical-record.controller";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/auth.middleware";

export async function GET(req: Request) {
    const user = await authMiddleware(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    return MedicalRecordController.listByPet(req);
}

export async function POST(req: Request) {
    const user = await authMiddleware(req);
    if (!user || user.role !== "veterinario") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return MedicalRecordController.create(req);
}
