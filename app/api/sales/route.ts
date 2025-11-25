import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import * as salesController from "@/controllers/sales.controller";

const adaptController = (handler: any) => async (req: NextRequest, { params }: any) => {
    await connectDB();
    const body = req.method !== "GET" ? await req.json().catch(() => ({})) : {};

    const reqMock: any = {
        body,
        params,
        method: req.method,
    };

    let responseData: any;
    let statusCode = 200;

    const resMock: any = {
        status: (code: number) => {
            statusCode = code;
            return resMock;
        },
        json: (data: any) => {
            responseData = data;
            return resMock;
        },
    };

    await handler(reqMock, resMock);
    return NextResponse.json(responseData, { status: statusCode });
};

export const GET = adaptController(salesController.getSales);
export const POST = adaptController(salesController.createSale);
