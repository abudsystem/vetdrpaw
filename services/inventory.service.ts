import { InventoryRepository } from "@/repositories/inventory.repo";
import { IProduct } from "@/models/Product";
import { UpdateQuery } from "mongoose";
import { AppError } from "@/lib/api-handler";

export const InventoryService = {
    listProducts: async (filters: {
        search?: string | null,
        category?: string | null,
        lowStock?: string | null,
        expiring?: string | null,
        id?: string | null
    }) => {
        let query: any = {};

        if (filters.id) query._id = filters.id;
        if (filters.search) query.name = { $regex: filters.search, $options: "i" };
        if (filters.category) query.category = filters.category;

        if (filters.lowStock === "true") {
            query.$expr = { $lte: ["$quantity", "$minStock"] };
        }

        if (filters.expiring === "true") {
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
            thirtyDaysFromNow.setHours(23, 59, 59, 999);
            query.expiryDate = { $lte: thirtyDaysFromNow };
        }

        return InventoryRepository.findProducts(query);
    },

    createProduct: (data: Partial<IProduct>) => InventoryRepository.createProduct(data),

    updateProduct: async (id: string, data: UpdateQuery<IProduct>) => {
        const product = await InventoryRepository.updateProduct(id, data);
        if (!product) throw new AppError("Producto no encontrado", 404);
        return product;
    },

    deleteProduct: async (id: string) => {
        const product = await InventoryRepository.deleteProduct(id);
        if (!product) throw new AppError("Producto no encontrado", 404);
        return product;
    },

    registerMovement: async (data: {
        productId: string,
        type: "ENTRADA" | "SALIDA" | "AJUSTE",
        quantity: number,
        reason?: string,
        userId: string
    }) => {
        const product = await InventoryRepository.findProductById(data.productId);
        if (!product) throw new AppError("Producto no encontrado", 404);

        let newQuantity = product.quantity;
        let finalType = data.type;
        let finalQuantity = data.quantity;

        if (data.type === "ENTRADA") {
            newQuantity += data.quantity;
        } else if (data.type === "SALIDA") {
            if (product.quantity < data.quantity) throw new AppError("Stock insuficiente", 400);
            newQuantity -= data.quantity;
        } else if (data.type === "AJUSTE") {
            const delta = data.quantity - product.quantity;
            if (delta === 0) throw new AppError("El stock ya es igual a la cantidad ingresada", 400);
            newQuantity = data.quantity;
            finalType = "AJUSTE";
            finalQuantity = Math.abs(delta);
        }

        await InventoryRepository.updateProduct(data.productId, { quantity: newQuantity });

        return InventoryRepository.createMovement({
            product: data.productId as any,
            type: finalType,
            quantity: finalQuantity,
            reason: data.reason || (data.type === "AJUSTE" ? "Corrección de inventario" : undefined),
            user: data.userId as any,
            date: new Date(),
        });
    },
};
