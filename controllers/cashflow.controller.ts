import { CashFlowService } from "@/services/cashflow.service";
import { apiHandler, AppError } from "@/lib/api-handler";
import { NextResponse } from "next/server";
import { z } from "zod";

// Schemas
const createCashFlowSchema = z.object({
    date: z.string().or(z.date()).transform((val) => new Date(val)),
    type: z.enum(['INGRESO', 'EGRESO']),
    category: z.enum(['VENTA', 'SERVICIO', 'GASTO', 'PAGO_PASIVO', 'COMPRA_INVENTARIO', 'OTRO']),
    description: z.string().min(1),
    amount: z.number().positive(),
    relatedDocument: z.string().optional(),
});

export const CashFlowController = {
    list: apiHandler(async () => {
        const transactions = await CashFlowService.list();
        return NextResponse.json(transactions);
    }, { requiredRoles: ['administrador'] }),

    create: apiHandler(async (req: Request, { user }) => {
        const body = await req.json();
        const data = createCashFlowSchema.parse(body);

        const transaction = await CashFlowService.create({
            ...data,
            createdBy: user!.id,
        } as any);
        return NextResponse.json(transaction, { status: 201 });
    }, { requiredRoles: ['administrador'] }),

    stats: apiHandler(async () => {
        const stats = await CashFlowService.getStats();
        return NextResponse.json(stats);
    }, { requiredRoles: ['administrador'] }),

    delete: apiHandler(async (req: Request, { params }) => {
        const id = params?.id;
        if (!id) throw new AppError("ID requerido", 400);

        await CashFlowService.delete(id);
        return NextResponse.json({ message: "Transacción eliminada" });
    }, { requiredRoles: ['administrador'] }),
};
