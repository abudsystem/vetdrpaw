import { LiabilityRepository } from "@/repositories/liability.repo";
import { ILiability } from "@/models/Liability";
import { AppError } from "@/lib/api-handler";
import { UpdateQuery } from "mongoose";

const calculateDetails = (liability: ILiability) => {
    const totalInterest = liability.amount * (liability.interestRate / 100) * liability.termMonths;
    const totalDebt = liability.amount + totalInterest;
    const pendingAmount = Math.max(0, totalDebt - liability.amountPaid);
    const monthlyPayment = totalDebt / liability.termMonths;

    return {
        ...liability.toObject(),
        totalInterest,
        totalDebt,
        pendingAmount,
        monthlyPayment
    };
};

export const LiabilityService = {
    list: async () => {
        const liabilities = await LiabilityRepository.find({});
        return liabilities.map(l => calculateDetails(l));
    },

    create: (data: Partial<ILiability>) => LiabilityRepository.create(data),

    getById: async (id: string) => {
        const liability = await LiabilityRepository.findById(id);
        if (!liability) throw new AppError("Pasivo no encontrado", 404);
        return calculateDetails(liability);
    },

    update: async (id: string, data: UpdateQuery<ILiability>) => {
        const updated = await LiabilityRepository.update(id, data);
        if (!updated) throw new AppError("Pasivo no encontrado", 404);
        return calculateDetails(updated);
    },

    delete: async (id: string) => {
        const deleted = await LiabilityRepository.delete(id);
        if (!deleted) throw new AppError("Pasivo no encontrado", 404);
        return deleted;
    },

    getStats: async () => {
        const liabilities = await LiabilityRepository.find({});
        let totalDebt = 0;
        let totalPending = 0;
        let totalPaid = 0;
        liabilities.forEach(l => {
            const details = calculateDetails(l);
            totalDebt += details.totalDebt;
            totalPending += details.pendingAmount;
            totalPaid += l.amountPaid;
        });
        return { totalDebt, totalPending, totalPaid, count: liabilities.length };
    },
};
