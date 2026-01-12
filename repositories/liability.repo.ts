import { Liability, ILiability } from "@/models/Liability";
import dbConnect from "@/lib/db";
import { UpdateQuery } from "mongoose";

export const LiabilityRepository = {
    find: async (query: any = {}) => {
        await dbConnect();
        return Liability.find(query).sort({ createdAt: -1 });
    },
    findById: async (id: string) => {
        await dbConnect();
        return Liability.findById(id);
    },
    create: async (data: Partial<ILiability>) => {
        await dbConnect();
        return Liability.create(data);
    },
    update: async (id: string, data: UpdateQuery<ILiability>) => {
        await dbConnect();
        return Liability.findByIdAndUpdate(id, data, { new: true });
    },
    delete: async (id: string) => {
        await dbConnect();
        return Liability.findByIdAndDelete(id);
    },
};
