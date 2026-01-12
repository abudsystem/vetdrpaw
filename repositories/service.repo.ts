import { Service, IService } from "@/models/Service";
import dbConnect from "@/lib/db";
import { UpdateQuery } from "mongoose";

export const ServiceRepository = {
    find: async (query: any = {}) => {
        await dbConnect();
        return Service.find(query).populate("supplies.product");
    },
    findById: async (id: string) => {
        await dbConnect();
        return Service.findById(id).populate("supplies.product");
    },
    create: async (data: Partial<IService>) => {
        await dbConnect();
        return Service.create(data);
    },
    update: async (id: string, data: UpdateQuery<IService>) => {
        await dbConnect();
        return Service.findByIdAndUpdate(id, data, { new: true });
    },
};
