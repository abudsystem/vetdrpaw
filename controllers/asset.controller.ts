import { AssetService } from "@/services/asset.service";
import { apiHandler, AppError } from "@/lib/api-handler";
import { NextResponse } from "next/server";
import { z } from "zod";

// Schemas
const createAssetSchema = z.object({
    name: z.string().min(1),
    category: z.string().min(1),
    quantity: z.number().min(1).default(1),
    unitCost: z.number().min(0),
    acquisitionDate: z.string().or(z.date()).transform((val) => new Date(val)),
    isDepreciable: z.boolean().default(false),
    usefulLifeMonths: z.number().optional(),
});

const updateAssetSchema = createAssetSchema.partial();

export const AssetController = {
    list: apiHandler(async (req: Request) => {
        const { searchParams } = new URL(req.url);
        const filters = {
            search: searchParams.get("search"),
            category: searchParams.get("category"),
        };
        const assets = await AssetService.list(filters);
        return NextResponse.json(assets);
    }, { requiredRoles: ['administrador'] }),

    create: apiHandler(async (req: Request) => {
        const body = await req.json();
        const data = createAssetSchema.parse(body);
        const asset = await AssetService.create(data as any);
        return NextResponse.json(asset, { status: 201 });
    }, { requiredRoles: ['administrador'] }),

    update: apiHandler(async (req: Request, { params }) => {
        const id = params?.id;
        if (!id) throw new AppError("ID requerido", 400);

        const body = await req.json();
        const data = updateAssetSchema.parse(body);
        const asset = await AssetService.update(id, data);
        return NextResponse.json(asset);
    }, { requiredRoles: ['administrador'] }),

    getById: apiHandler(async (req, { params }) => {
        const id = params?.id;
        if (!id) throw new AppError("ID requerido", 400);

        const asset = await AssetService.getById(id);
        return NextResponse.json(asset);
    }, { requiredRoles: ['administrador'] }),

    delete: apiHandler(async (req, { params }) => {
        const id = params?.id;
        if (!id) throw new AppError("ID requerido", 400);

        await AssetService.delete(id);
        return NextResponse.json({ message: "Activo eliminado" });
    }, { requiredRoles: ['administrador'] }),

    stats: apiHandler(async () => {
        const stats = await AssetService.getStats();
        return NextResponse.json(stats);
    }, { requiredRoles: ['administrador'] }),
};
