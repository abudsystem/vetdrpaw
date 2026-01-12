import { InventoryService } from "@/services/inventory.service";
import { apiHandler, AppError } from "@/lib/api-handler";
import { NextResponse } from "next/server";
import { z } from "zod";

// Schemas
const createProductSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    category: z.string().min(1),
    quantity: z.number().min(0).default(0),
    unitCost: z.number().min(0),
    salePrice: z.number().min(0),
    minStock: z.number().min(0).default(5),
    provider: z.string().optional(),
    expiryDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
    location: z.string().optional(),
});

const updateProductSchema = createProductSchema.partial().extend({
    id: z.string(),
});

const movementSchema = z.object({
    productId: z.string(),
    type: z.enum(["ENTRADA", "SALIDA", "AJUSTE"]),
    quantity: z.number().positive(),
    reason: z.string().optional(),
});

export const InventoryController = {
    list: apiHandler(async (req: Request) => {
        const { searchParams } = new URL(req.url);
        const filters = {
            search: searchParams.get("search"),
            category: searchParams.get("category"),
            lowStock: searchParams.get("lowStock"),
            expiring: searchParams.get("expiring"),
            id: searchParams.get("id"),
        };

        const products = await InventoryService.listProducts(filters);
        return NextResponse.json(products);
    }, { requiredRoles: ["administrador", "veterinario"] }),

    create: apiHandler(async (req: Request) => {
        const body = await req.json();
        const data = createProductSchema.parse(body);

        const product = await InventoryService.createProduct(data);
        return NextResponse.json(product, { status: 201 });
    }, { requiredRoles: ["administrador"] }),

    update: apiHandler(async (req: Request) => {
        const body = await req.json();
        const { id, ...data } = updateProductSchema.parse(body);

        const product = await InventoryService.updateProduct(id, data);
        return NextResponse.json(product);
    }, { requiredRoles: ["administrador"] }),

    delete: apiHandler(async (req: Request) => {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) throw new AppError("ID requerido", 400);

        await InventoryService.deleteProduct(id);
        return NextResponse.json({ message: "Producto eliminado" });
    }, { requiredRoles: ["administrador"] }),

    registerMovement: apiHandler(async (req: Request, { user }) => {
        const body = await req.json();
        const data = movementSchema.parse(body);

        const movement = await InventoryService.registerMovement({ ...data, userId: user!.id });
        return NextResponse.json(movement, { status: 201 });
    }, { requiredRoles: ["administrador", "veterinario"] }),
};
