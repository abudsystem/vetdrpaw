import { Asset, IAsset } from "@/models/Asset";
import dbConnect from "@/lib/db";
import { UpdateQuery } from "mongoose";

export const AssetRepository = {
    find: async (query: any = {}) => {
        await dbConnect();
        return Asset.find(query).sort({ createdAt: -1 });
    },
    findById: async (id: string) => {
        await dbConnect();
        return Asset.findById(id);
    },
    create: async (data: Partial<IAsset>) => {
        await dbConnect();
        return Asset.create(data);
    },
    update: async (id: string, data: UpdateQuery<IAsset>) => {
        await dbConnect();
        return Asset.findByIdAndUpdate(id, data, { new: true });
    },
    delete: async (id: string) => {
        await dbConnect();
        return Asset.findByIdAndDelete(id);
    },
};
