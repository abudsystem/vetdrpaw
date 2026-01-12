import { CashFlow, ICashFlow } from "@/models/CashFlow";
import dbConnect from "@/lib/db";

export const CashFlowRepository = {
    find: async (query: any = {}) => {
        await dbConnect();
        return CashFlow.find(query).sort({ date: -1, createdAt: -1 });
    },
    create: async (data: Partial<ICashFlow>) => {
        await dbConnect();
        return CashFlow.create(data);
    },
    delete: async (id: string) => {
        await dbConnect();
        return CashFlow.findByIdAndDelete(id);
    },
};
