import { Sale } from "@/models/Sale";
import { Product } from "@/models/Product";
import { Service } from "@/models/Service";
import { User } from "@/models/User";
import { Appointment } from "@/models/Appointment";
import { CashFlow } from "@/models/CashFlow";
import { Pet } from "@/models/Pet";
import dbConnect from "@/lib/db";

export const AnalyticsService = {
    getDashboardData: async () => {
        await dbConnect();
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

        const currentMonthSales = await Sale.aggregate([
            { $match: { date: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } }
        ]);

        const lastMonthSales = await Sale.aggregate([
            { $match: { date: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
            { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } }
        ]);

        const totalRevenue = currentMonthSales[0]?.total || 0;
        const lastMonthRevenue = lastMonthSales[0]?.total || 0;
        const growth = lastMonthRevenue === 0 ? 100 : ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

        const sixMonthsAgo = new Date(today);
        sixMonthsAgo.setMonth(today.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const salesOverTime = await Sale.aggregate([
            { $match: { date: { $gte: sixMonthsAgo } } },
            { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$date" } }, total: { $sum: "$total" } } },
            { $sort: { _id: 1 } }
        ]);

        return {
            metrics: { totalRevenue, salesCount: currentMonthSales[0]?.count || 0, growth: Math.round(growth * 10) / 10, lastMonthRevenue },
            charts: { salesOverTime }
        };
    },

    getFinancialStats: async () => {
        await dbConnect();
        const today = new Date();
        const startOfYear = new Date(today.getFullYear(), 0, 1);

        const cashFlow = await CashFlow.aggregate([
            { $match: { date: { $gte: startOfYear } } },
            { $group: { _id: { month: { $dateToString: { format: "%Y-%m", date: "$date" } }, type: "$type" }, total: { $sum: "$amount" } } },
            { $sort: { "_id.month": 1 } }
        ]);

        const expensesBreakdown = await CashFlow.aggregate([
            { $match: { date: { $gte: startOfYear }, type: "EGRESO" } },
            { $group: { _id: "$category", total: { $sum: "$amount" } } }
        ]);

        const initialBalanceResult = await CashFlow.aggregate([
            { $match: { date: { $lt: startOfYear } } },
            { $group: { _id: null, totalIncome: { $sum: { $cond: [{ $eq: ["$type", "INGRESO"] }, "$amount", 0] } }, totalExpense: { $sum: { $cond: [{ $eq: ["$type", "EGRESO"] }, "$amount", 0] } } } }
        ]);

        let currentBalance = 0;
        if (initialBalanceResult.length > 0) {
            currentBalance = initialBalanceResult[0].totalIncome - initialBalanceResult[0].totalExpense;
        }

        const monthlyStats = [];
        const months = new Set(cashFlow.map((c: any) => c._id.month));
        const sortedMonths = Array.from(months).sort();

        for (const month of sortedMonths) {
            const income = cashFlow.find((c: any) => c._id.month === month && c._id.type === "INGRESO")?.total || 0;
            const expense = cashFlow.find((c: any) => c._id.month === month && c._id.type === "EGRESO")?.total || 0;
            const netFlow = income - expense;
            currentBalance += netFlow;
            monthlyStats.push({ month, income, expense, netFlow, accumulatedBalance: currentBalance });
        }

        return { cashFlow, expensesBreakdown, monthlyStats };
    },

    getClientStats: async () => {
        await dbConnect();
        const today = new Date();
        const startOfYear = new Date(today.getFullYear(), 0, 1);

        const newClients = await User.aggregate([
            { $match: { role: "cliente", createdAt: { $gte: startOfYear } } },
            { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        const petDemographics = await Pet.aggregate([
            { $group: { _id: "$especie", count: { $sum: 1 } } }
        ]);

        return { newClients, petDemographics };
    },

    getSalesStats: async () => {
        await dbConnect();
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const salesByCategory = await Sale.aggregate([
            { $match: { date: { $gte: startOfMonth } } },
            { $unwind: "$products" },
            { $group: { _id: "Productos", total: { $sum: { $multiply: ["$products.price", "$products.quantity"] } } } }
        ]);

        const servicesByCategory = await Sale.aggregate([
            { $match: { date: { $gte: startOfMonth } } },
            { $unwind: "$services" },
            { $group: { _id: "Servicios", total: { $sum: { $multiply: ["$services.price", "$services.quantity"] } } } }
        ]);

        const topProducts = await Sale.aggregate([
            { $match: { date: { $gte: startOfMonth } } },
            { $unwind: "$products" },
            { $group: { _id: "$products.name", quantity: { $sum: "$products.quantity" }, revenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } } } },
            { $sort: { quantity: -1 } },
            { $limit: 5 }
        ]);

        return { salesByCategory: [...salesByCategory, ...servicesByCategory], topProducts };
    },

    getOperationStats: async () => {
        await dbConnect();
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const appointmentStats = await Appointment.aggregate([
            { $match: { date: { $gte: startOfMonth } } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        return { appointmentStats };
    }
};
