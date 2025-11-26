import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import * as salesController from "@/controllers/sales.controller";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    return salesController.getSaleById(req, { params });
}
