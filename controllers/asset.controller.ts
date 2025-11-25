import { Asset, IAsset } from "@/models/Asset";
import { apiHandler, AppError } from "@/lib/api-handler";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
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

const updateAssetSchema = createAssetSchema.partial().extend({
    id: z.string(),
});

// Helper to calculate current value
const calculateCurrentValue = (asset: IAsset): number => {
    if (!asset.isDepreciable || !asset.usefulLifeMonths || asset.usefulLifeMonths <= 0) {
        return asset.initialValue;
    }

    const now = new Date();
    const acquisition = new Date(asset.acquisitionDate);

    // Calculate months elapsed
    const monthsElapsed = (now.getFullYear() - acquisition.getFullYear()) * 12 + (now.getMonth() - acquisition.getMonth());

    if (monthsElapsed <= 0) return asset.initialValue;

    const monthlyDepreciation = asset.initialValue / asset.usefulLifeMonths;
    const totalDepreciation = monthlyDepreciation * monthsElapsed;
    const currentValue = asset.initialValue - totalDepreciation;

    return Math.max(0, Number(currentValue.toFixed(2)));
};

export const AssetController = {
    // List assets
    list: apiHandler(async (req: Request) => {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search");
        const category = searchParams.get("category");

        let query: any = {};

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }
        if (category) {
            query.category = category;
        }

        const assets = await Asset.find(query).sort({ createdAt: -1 });

        // Calculate current values on the fly for display
        const assetsWithCurrentValue = assets.map(asset => {
            const currentVal = calculateCurrentValue(asset);
            // We return the asset object with the updated totalValue for display purposes
            // We do NOT save to DB here to avoid write overhead on read
            return {
                ...asset.toObject(),
                totalValue: currentVal
            };
        });

        return NextResponse.json(assetsWithCurrentValue);
    }),

    // Create new asset
    create: apiHandler(async (req: Request) => {
        await connectDB();
        const body = await req.json();
        const data = createAssetSchema.parse(body);

        const initialValue = data.quantity * data.unitCost;

        const asset = await Asset.create({
            ...data,
            initialValue,
            totalValue: initialValue, // Starts at initial value
        });

        return NextResponse.json(asset, { status: 201 });
    }),

    // Update asset
    update: apiHandler(async (req: Request) => {
        await connectDB();
        const body = await req.json();
        const { id, ...data } = updateAssetSchema.parse(body);

        // Recalculate initialValue if cost or quantity changed
        let updateData: any = { ...data };

        // If we are updating cost or quantity, we need to update initialValue
        // But we need the current document to know if they changed if not provided
        // For simplicity, if provided, we recalculate.

        const currentAsset = await Asset.findById(id);
        if (!currentAsset) throw new AppError("Activo no encontrado", 404);

        const newQuantity = data.quantity ?? currentAsset.quantity;
        const newUnitCost = data.unitCost ?? currentAsset.unitCost;
        const newInitialValue = newQuantity * newUnitCost;

        updateData.initialValue = newInitialValue;

        // We also update totalValue to the new initial value (resetting depreciation base?)
        // Or should we keep depreciation? 
        // Usually if you change the cost/quantity, you are correcting a mistake, so resetting is fine.
        // If it's a new valuation, that's different. Assuming correction.

        // However, we should check if we should apply depreciation immediately?
        // Let's just save the new initial parameters. The list endpoint will calculate current value.
        // But we should also update the stored totalValue to be consistent.

        // Let's create a temporary object to calculate the current value
        const tempAsset = {
            ...currentAsset.toObject(),
            ...updateData,
            acquisitionDate: data.acquisitionDate ? new Date(data.acquisitionDate) : currentAsset.acquisitionDate
        } as unknown as IAsset;

        updateData.totalValue = calculateCurrentValue(tempAsset);

        const asset = await Asset.findByIdAndUpdate(id, updateData, { new: true });

        return NextResponse.json(asset);
    }),

    // Get asset by ID
    getById: apiHandler(async (req: Request) => {
        await connectDB();
        // Extract ID from the URL since it's not passed as a parameter in the handler signature in this pattern
        // Actually, in Next.js App Router, the second argument to the handler is { params }.
        // But my apiHandler wrapper might not be passing it?
        // Let's check apiHandler implementation or just parse the URL.
        // The [id] route will have the ID in the URL.
        // But wait, the previous delete method used searchParams?
        // "const id = searchParams.get("id");"
        // In [id]/route.ts, the ID is usually in params.
        // Let's check how I implemented DELETE in the controller.
        // "const id = searchParams.get("id");"
        // This suggests I was expecting /api/assets?id=... for delete?
        // But I created app/api/assets/[id]/route.ts.
        // In [id]/route.ts, the request URL will be .../api/assets/123.
        // searchParams.get("id") will be null unless I do .../api/assets/123?id=123.
        // This is a mistake in my previous controller implementation for DELETE.

        // I need to fix DELETE and implement GET/PUT correctly using the ID from the URL path, 
        // OR I need to change the route file to pass params.

        // In Next.js App Router:
        // export async function GET(request: Request, { params }: { params: { id: string } }) { ... }

        // My apiHandler wrapper:
        // export const apiHandler = (handler: (req: Request) => Promise<NextResponse>) => ...
        // It seems it only accepts req.

        // If apiHandler doesn't pass the second argument, I can't access params easily unless I parse the URL manually.
        // URL: http://localhost:3000/api/assets/123
        // I can split the pathname.

        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();

        if (!id) throw new AppError("ID requerido", 400);

        const asset = await Asset.findById(id);
        if (!asset) throw new AppError("Activo no encontrado", 404);

        // Calculate current value
        const currentVal = calculateCurrentValue(asset);

        return NextResponse.json({
            ...asset.toObject(),
            totalValue: currentVal
        });
    }),

    // Delete asset
    delete: apiHandler(async (req: Request) => {
        await connectDB();
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();

        if (!id) throw new AppError("ID requerido", 400);

        const asset = await Asset.findByIdAndDelete(id);
        if (!asset) throw new AppError("Activo no encontrado", 404);

        return NextResponse.json({ message: "Activo eliminado" });
    }),

    // Get stats (Total Value)
    stats: apiHandler(async (req: Request) => {
        await connectDB();
        const assets = await Asset.find({});

        let totalAssetsValue = 0;
        let totalDepreciation = 0;
        let count = assets.length;

        assets.forEach(asset => {
            const currentVal = calculateCurrentValue(asset);
            totalAssetsValue += currentVal;
            totalDepreciation += (asset.initialValue - currentVal);
        });

        return NextResponse.json({
            totalValue: totalAssetsValue,
            totalDepreciation,
            count
        });
    }),
};
