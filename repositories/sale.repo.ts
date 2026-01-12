import { Sale, ISale } from "@/models/Sale";
import dbConnect from "@/lib/db";
import { ClientSession } from "mongoose";

export const SaleRepository = {
    find: async (query: any = {}) => {
        await dbConnect();
        return Sale.find(query)
            .populate("client", "name email")
            .populate("pet", "nombre especie")
            .populate("appointment", "reason date")
            .populate("user", "name")
            .populate("products.product", "name")
            .populate("services.service", "name")
            .sort({ createdAt: -1 });
    },
    findById: async (id: string) => {
        await dbConnect();
        return Sale.findById(id)
            .populate("client", "name email")
            .populate("pet", "nombre especie")
            .populate("appointment", "reason date")
            .populate("user", "name")
            .populate("products.product", "name")
            .populate("services.service", "name");
    },
    create: async (data: Partial<ISale>, session?: ClientSession) => {
        await dbConnect();
        const sale = new Sale(data);
        return sale.save({ session });
    },
};
