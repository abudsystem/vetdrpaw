import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import * as salesController from "@/controllers/sales.controller";

export async function GET(req: NextRequest) {
    await connectDB();
    return salesController.getSales(req);
}

export async function POST(req: NextRequest) {
    await connectDB();
    return salesController.createSale(req);
}
