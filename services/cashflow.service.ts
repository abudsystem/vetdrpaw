import { CashFlowRepository } from "@/repositories/cashflow.repo";
import { ICashFlow } from "@/models/CashFlow";
import { AppError } from "@/lib/api-handler";

export const CashFlowService = {
    list: () => CashFlowRepository.find({}),
    create: (data: Partial<ICashFlow>) => CashFlowRepository.create(data),
    delete: async (id: string) => {
        const deleted = await CashFlowRepository.delete(id);
        if (!deleted) throw new AppError("Transacción no encontrada", 404);
        return deleted;
    },
    getStats: async () => {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const allTransactions = await CashFlowRepository.find({});
        const dailyTransactions = await CashFlowRepository.find({ date: { $gte: startOfDay } });
        const monthlyTransactions = await CashFlowRepository.find({ date: { $gte: startOfMonth } });

        const calculateBalance = (transactions: ICashFlow[]) => {
            let ingresos = 0;
            let egresos = 0;
            transactions.forEach(t => {
                if (t.type === 'INGRESO') ingresos += t.amount;
                else egresos += t.amount;
            });
            return { ingresos, egresos, balance: ingresos - egresos };
        };

        const daily = calculateBalance(dailyTransactions);
        const monthly = calculateBalance(monthlyTransactions);
        const currentCash = calculateBalance(allTransactions);

        return {
            daily,
            monthly,
            currentCash: currentCash.balance,
            totalTransactions: allTransactions.length
        };
    },
};
