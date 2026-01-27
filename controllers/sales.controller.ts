import { SaleService } from "@/services/sales.service";
import { apiHandler, AppError } from "@/lib/api-handler";
import { NextResponse } from "next/server";
import { z } from "zod";

const createSaleSchema = z.object({
    products: z.array(z.object({
        product: z.string(),
        quantity: z.number().positive(),
        price: z.number().optional(),
    })).optional(),
    services: z.array(z.object({
        service: z.string(),
        quantity: z.number().positive(),
        price: z.number().optional(),
    })).optional(),
    paymentMethod: z.enum(['Efectivo', 'Tarjeta', 'Transferencia', 'Otro']),
    client: z.string().optional().nullable(),
    pet: z.string().optional().nullable(),
    appointment: z.string().optional().nullable(),
    invoiceNumber: z.string().optional(),
});

export const SalesController = {
    list: apiHandler(async () => {
        const sales = await SaleService.getSales();
        return NextResponse.json(sales);
    }, { requiredRoles: ['veterinario', 'administrador', 'vendedor'] }),

    getById: apiHandler(async (req, { params }) => {
        const id = params?.id;
        if (!id) throw new AppError("ID requerido", 400);
        const sale = await SaleService.getSaleById(id);
        return NextResponse.json(sale);
    }, { requiredRoles: ['veterinario', 'administrador', 'vendedor'] }),

    create: apiHandler(async (req: Request, { user }) => {
        const body = await req.json();
        const data = createSaleSchema.parse(body);
        const sale = await SaleService.createSale({
            ...data,
            userId: user!.id
        });
        return NextResponse.json(sale, { status: 201 });
    }, { requiredRoles: ['administrador', 'vendedor', 'veterinario'] }),
};
