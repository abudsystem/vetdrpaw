import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import * as servicesController from "@/controllers/services.controller";

// Adapt Express controller to Next.js App Router
const adaptController = (handler: any) => async (req: NextRequest, { params }: any) => {
    await connectDB();
    const body = req.method !== "GET" && req.method !== "DELETE" ? await req.json().catch(() => ({})) : {};
    const searchParams = Object.fromEntries(req.nextUrl.searchParams);

    // Mock Express Request and Response
    const reqMock: any = {
        body,
        query: searchParams,
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

export const GET = adaptController(servicesController.getServices);
export const POST = adaptController(servicesController.createService);
