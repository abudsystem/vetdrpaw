import { Product, IProduct } from "@/models/Product";
import { InventoryMovement } from "@/models/InventoryMovement";
import { apiHandler, AppError } from "@/lib/api-handler";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
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
    userId: z.string(),
});

export const InventoryController = {
    // List products with filters
    list: apiHandler(async (req: Request) => {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search");
        const category = searchParams.get("category");
        const lowStock = searchParams.get("lowStock");
        const expiring = searchParams.get("expiring");
        const id = searchParams.get("id");

        let query: any = {};

        if (id) {
            query._id = id;
        }
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }
        if (category) {
            query.category = category;
        }
        if (lowStock === "true") {
            query.$expr = { $lte: ["$quantity", "$minStock"] };
        }
        if (expiring === "true") {
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
            thirtyDaysFromNow.setHours(23, 59, 59, 999);
            query.expiryDate = { $lte: thirtyDaysFromNow };
        }

        const products = await Product.find(query).sort({ createdAt: -1 });
        return NextResponse.json(products);
    }),

    // Create new product
    create: apiHandler(async (req: Request) => {
        await connectDB();
        const body = await req.json();
        const data = createProductSchema.parse(body);

        const product = await Product.create(data);
        return NextResponse.json(product, { status: 201 });
    }),

    // Update product
    update: apiHandler(async (req: Request) => {
        await connectDB();
        const body = await req.json();
        const { id, ...data } = updateProductSchema.parse(body);

        const product = await Product.findByIdAndUpdate(id, data, { new: true });
        if (!product) throw new AppError("Producto no encontrado", 404);

        return NextResponse.json(product);
    }),

    // Delete product
    delete: apiHandler(async (req: Request) => {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) throw new AppError("ID requerido", 400);

        const product = await Product.findByIdAndDelete(id);
        if (!product) throw new AppError("Producto no encontrado", 404);

        return NextResponse.json({ message: "Producto eliminado" });
    }),

    // Register movement
    registerMovement: apiHandler(async (req: Request) => {
        await connectDB();
        const body = await req.json();
        const { productId, type, quantity, reason, userId } = movementSchema.parse(body);

        const product = await Product.findById(productId);
        if (!product) throw new AppError("Producto no encontrado", 404);

        // Calculate new quantity
        let newQuantity = product.quantity;
        let finalType = type;
        let finalQuantity = quantity;

        if (type === "ENTRADA") {
            newQuantity += quantity;
        } else if (type === "SALIDA") {
            if (product.quantity < quantity) {
                throw new AppError("Stock insuficiente", 400);
            }
            newQuantity -= quantity;
        } else if (type === "AJUSTE") {
            // AJUSTE sets the stock to the specific quantity
            // We calculate the delta to store in the movement history
            const delta = quantity - product.quantity;
            if (delta === 0) throw new AppError("El stock ya es igual a la cantidad ingresada", 400);

            newQuantity = quantity;

            // Determine if it was effectively an entry or exit for history purposes
            // Or we can store it as AJUSTE with the absolute delta
            finalType = delta > 0 ? "ENTRADA" : "SALIDA";
            finalQuantity = Math.abs(delta);

            // Note: We could also keep type as AJUSTE in DB if we want to be explicit
            // But for simplicity in reporting, mapping to ENTRADA/SALIDA with a reason might be easier.
            // However, let's respect the enum and store AJUSTE if the model supports it.
            // The model supports AJUSTE. Let's use it.
            finalType = "AJUSTE";
            finalQuantity = Math.abs(delta);
        }

        product.quantity = newQuantity;
        await product.save();

        await InventoryMovement.create({
            product: productId,
            type: finalType,
            quantity: finalQuantity,
            reason: reason || (type === "AJUSTE" ? "Corrección de inventario" : undefined),
            user: userId,
            date: new Date(),
        });

        return NextResponse.json(product);
    }),
};
