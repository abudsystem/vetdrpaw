import { Sale } from "../models/Sale";
import { Product } from "../models/Product";
import { Service } from "../models/Service";
import { User } from "../models/User";
import { Appointment } from "../models/Appointment";
import { CashFlow } from "../models/CashFlow";
import mongoose from "mongoose";

export const AnalyticsController = {
    getDashboardData: async () => {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

        // 1. Key Metrics
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

        // 2. Sales Over Time (Last 6 months for Overview)
        const sixMonthsAgo = new Date(today);
        sixMonthsAgo.setMonth(today.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const salesOverTime = await Sale.aggregate([
            { $match: { date: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
                    total: { $sum: "$total" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        return {
            metrics: {
                totalRevenue,
                salesCount: currentMonthSales[0]?.count || 0,
                growth: Math.round(growth * 10) / 10,
                lastMonthRevenue
            },
            charts: {
                salesOverTime
            }
        };
    },

    getFinancialStats: async () => {
        const today = new Date();
        const startOfYear = new Date(today.getFullYear(), 0, 1);

        // Cash Flow (Income vs Expenses)
        const cashFlow = await CashFlow.aggregate([
            { $match: { date: { $gte: startOfYear } } },
            {
                $group: {
                    _id: {
                        month: { $dateToString: { format: "%Y-%m", date: "$date" } },
                        type: "$type"
                    },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.month": 1 } }
        ]);

        // Expenses Breakdown
        const expensesBreakdown = await CashFlow.aggregate([
            { $match: { date: { $gte: startOfYear }, type: "EGRESO" } },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" }
                }
            }
        ]);

        return { cashFlow, expensesBreakdown };
    },

    getClientStats: async () => {
        const today = new Date();
        const startOfYear = new Date(today.getFullYear(), 0, 1);

        // New Clients per Month
        const newClients = await User.aggregate([
            { $match: { role: "cliente", createdAt: { $gte: startOfYear } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Pet Demographics (Species)
        const { Pet } = await import("../models/Pet");
        const petDemographics = await Pet.aggregate([
            {
                $group: {
                    _id: "$especie",
                    count: { $sum: 1 }
                }
            }
        ]);

        return { newClients, petDemographics };
    },

    getSalesStats: async () => {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // Sales by Category (Products vs Services)
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

        // Top Selling Products
        const topProducts = await Sale.aggregate([
            { $match: { date: { $gte: startOfMonth } } },
            { $unwind: "$products" },
            {
                $group: {
                    _id: "$products.name",
                    quantity: { $sum: "$products.quantity" },
                    revenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } }
                }
            },
            { $sort: { quantity: -1 } },
            { $limit: 5 }
        ]);

        return {
            salesByCategory: [...salesByCategory, ...servicesByCategory],
            topProducts
        };
    },

    getOperationStats: async () => {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // Appointment Status
        const appointmentStats = await Appointment.aggregate([
            { $match: { date: { $gte: startOfMonth } } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        return { appointmentStats };
    }
};
