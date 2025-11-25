import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { AnalyticsController } from "@/controllers/analytics.controller";
import { authMiddleware } from "@/middleware/auth.middleware";

export async function GET(req: Request) {
    await connectDB();
    const user = await authMiddleware(req);

    if (!user || user.role !== "administrador") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const data = await AnalyticsController.getDashboardData();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return NextResponse.json({ error: "Error fetching analytics data" }, { status: 500 });
    }
}
