import { LiabilityService } from "@/services/liability.service";
import { apiHandler, AppError } from "@/lib/api-handler";
import { NextResponse } from "next/server";
import { z } from "zod";

// Schemas
const createLiabilitySchema = z.object({
    type: z.enum(['PRESTAMO', 'OBLIGACION']),
    description: z.string().min(1),
    amount: z.number().positive(),
    startDate: z.string().or(z.date()).transform((val) => new Date(val)),
    interestRate: z.number().min(0).default(0),
    termMonths: z.number().int().positive().default(1),
    amountPaid: z.number().min(0).default(0),
});

const updateLiabilitySchema = createLiabilitySchema.partial();

export const LiabilityController = {
    list: apiHandler(async () => {
        const liabilities = await LiabilityService.list();
        return NextResponse.json(liabilities);
    }, { requiredRoles: ['administrador'] }),

    create: apiHandler(async (req: Request) => {
        const body = await req.json();
        const data = createLiabilitySchema.parse(body);
        const liability = await LiabilityService.create(data as any);
        return NextResponse.json(liability, { status: 201 });
    }, { requiredRoles: ['administrador'] }),

    getById: apiHandler(async (req, { params }) => {
        const id = params?.id;
        if (!id) throw new AppError("ID requerido", 400);

        const liability = await LiabilityService.getById(id);
        return NextResponse.json(liability);
    }, { requiredRoles: ['administrador'] }),

    update: apiHandler(async (req, { params }) => {
        const id = params?.id;
        if (!id) throw new AppError("ID requerido", 400);

        const body = await req.json();
        const data = updateLiabilitySchema.parse(body);
        const liability = await LiabilityService.update(id, data as any);
        return NextResponse.json(liability);
    }, { requiredRoles: ['administrador'] }),

    delete: apiHandler(async (req, { params }) => {
        const id = params?.id;
        if (!id) throw new AppError("ID requerido", 400);

        await LiabilityService.delete(id);
        return NextResponse.json({ message: "Pasivo eliminado" });
    }, { requiredRoles: ['administrador'] }),

    stats: apiHandler(async () => {
        const stats = await LiabilityService.getStats();
        return NextResponse.json(stats);
    }, { requiredRoles: ['administrador'] }),
};
