import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import * as salesController from "@/controllers/sales.controller";

const adaptController = (handler: any) => async (req: NextRequest, context: any) => {
    await connectDB();

    const params = await context.params;

    const reqMock: any = {
        params,
        method: req.method,
        body: {},
    };

    // Try to parse body for non-GET requests
    if (req.method !== 'GET' && req.method !== 'DELETE') {
        try {
            reqMock.body = await req.json();
        } catch (e) {
            // Body might be empty
        }
    }

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

export const GET = adaptController(salesController.getSaleById);
