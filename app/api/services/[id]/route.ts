import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import * as servicesController from "@/controllers/services.controller";

const adaptController = (handler: any) => async (req: NextRequest, { params }: any) => {
    await connectDB();
    const body = req.method !== "GET" && req.method !== "DELETE" ? await req.json().catch(() => ({})) : {};

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

export const GET = adaptController(servicesController.getServiceById);
export const PUT = adaptController(servicesController.updateService);
// Using DELETE verb for "Toggle Status" might be confusing if it's not a hard delete, 
// but commonly used. Alternatively, we can use a specific PATCH endpoint. 
// For now, I'll map DELETE to toggleServiceStatus as per common "soft delete" patterns, 
// or I can check if the user wants a specific endpoint. 
// Given the controller is `toggleServiceStatus`, let's use PATCH for toggle to be more semantic, 
// or keep DELETE if "removing" is the mental model. 
// Let's stick to the plan: "Habilitar activar/desactivar servicios sin borrarlos".
// I will expose a specific route for toggle or just use PUT with isActive flip?
// The controller `toggleServiceStatus` is specific. Let's map it to DELETE for now as a "remove/restore" action, 
// or better, let's add a specific `PATCH` handler in the same file if Next.js allows.
// Actually, let's just use PUT for updates. 
// Wait, I need a way to call `toggleServiceStatus`. 
// I'll create a separate route `[id]/toggle` or just handle it here.
// Let's use PATCH for toggle.
export const PATCH = adaptController(servicesController.toggleServiceStatus);
