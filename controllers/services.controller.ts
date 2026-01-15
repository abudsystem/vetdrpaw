import { ServicesService } from "@/services/services.service";
import { apiHandler, AppError } from "@/lib/api-handler";
import { NextResponse } from "next/server";
import { z } from "zod";

const serviceSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    basePrice: z.number().nonnegative(),
    operatingCost: z.number().nonnegative().default(0),
    supplies: z.array(z.object({
        product: z.string(),
        quantity: z.number().positive(),
    })).default([]),
    duration: z.number().positive().optional(),
});

export const ServicesController = {
    list: apiHandler(async (req: Request) => {
        const { searchParams } = new URL(req.url);
        const activeOnly = searchParams.get("activeOnly") === "true";
        const services = await ServicesService.getServices(activeOnly);
        return NextResponse.json(services);
    }),

    getById: apiHandler(async (req, { params }) => {
        const id = params?.id;
        if (!id) throw new AppError("ID requerido", 400);
        const service = await ServicesService.getServiceById(id);
        return NextResponse.json(service);
    }),

    create: apiHandler(async (req: Request) => {
        const body = await req.json();
        const data = serviceSchema.parse(body);
        const service = await ServicesService.createService(data as any);
        return NextResponse.json(service, { status: 201 });
    }, { requiredRoles: ['administrador', 'veterinario'] }),

    update: apiHandler(async (req: Request, { params }) => {
        const id = params?.id;
        if (!id) throw new AppError("ID requerido", 400);
        const body = await req.json();
        const data = serviceSchema.partial().parse(body);
        const service = await ServicesService.updateService(id, data as any);
        return NextResponse.json(service);
    }, { requiredRoles: ['administrador', 'veterinario'] }),

    toggleStatus: apiHandler(async (req, { params }) => {
        const id = params?.id;
        if (!id) throw new AppError("ID requerido", 400);
        const service = await ServicesService.toggleServiceStatus(id);
        return NextResponse.json(service);
    }, { requiredRoles: ['administrador', 'veterinario'] }),

    deductSupplies: apiHandler(async (req: Request, { params, user }) => {
        const id = params?.id;
        if (!id) throw new AppError("ID requerido", 400);
        const result = await ServicesService.deductSupplies(id, user!.id);
        return NextResponse.json(result);
    }, { requiredRoles: ['administrador', 'veterinario'] }),
};
