import { Product, IProduct } from "@/models/Product";
import { InventoryMovement, IInventoryMovement } from "@/models/InventoryMovement";
import dbConnect from "@/lib/db";
import { UpdateQuery } from "mongoose";

export const InventoryRepository = {
    findProducts: async (query: any) => {
        await dbConnect();
        return Product.find(query).sort({ createdAt: -1 });
    },

    findProductById: async (id: string) => {
        await dbConnect();
        return Product.findById(id);
    },

    createProduct: async (data: Partial<IProduct>) => {
        await dbConnect();
        return Product.create(data);
    },

    updateProduct: async (id: string, data: UpdateQuery<IProduct>) => {
        await dbConnect();
        return Product.findByIdAndUpdate(id, data, { new: true });
    },

    deleteProduct: async (id: string) => {
        await dbConnect();
        return Product.findByIdAndDelete(id);
    },

    createMovement: async (data: Partial<IInventoryMovement>) => {
        await dbConnect();
        return InventoryMovement.create(data);
    },
};
