import { CashFlow, ICashFlow } from "@/models/CashFlow";
import { apiHandler, AppError } from "@/lib/api-handler";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { z } from "zod";

// Schemas
const createCashFlowSchema = z.object({
    date: z.string().or(z.date()).transform((val) => new Date(val)),
    type: z.enum(['INGRESO', 'EGRESO']),
    category: z.enum(['VENTA', 'SERVICIO', 'GASTO', 'PAGO_PASIVO', 'COMPRA_INVENTARIO', 'OTRO']),
    description: z.string().min(1),
    amount: z.number().positive(),
    relatedDocument: z.string().optional(),
    createdBy: z.string(),
});

export const CashFlowController = {
    // List all transactions
    list: apiHandler(async (req: Request) => {
        await connectDB();
        const transactions = await CashFlow.find({}).sort({ date: -1, createdAt: -1 });
        return NextResponse.json(transactions);
    }),

    // Create new transaction
    create: apiHandler(async (req: Request) => {
        await connectDB();
        const body = await req.json();
        const data = createCashFlowSchema.parse(body);

        const transaction = await CashFlow.create(data);
        return NextResponse.json(transaction, { status: 201 });
    }),

    // Get statistics (daily, monthly balances, current cash)
    stats: apiHandler(async (req: Request) => {
        await connectDB();

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Get all transactions
        const allTransactions = await CashFlow.find({});

        // Daily transactions
        const dailyTransactions = await CashFlow.find({
            date: { $gte: startOfDay }
        });

        // Monthly transactions
        const monthlyTransactions = await CashFlow.find({
            date: { $gte: startOfMonth }
        });

        // Calculate balances
        const calculateBalance = (transactions: ICashFlow[]) => {
            let ingresos = 0;
            let egresos = 0;

            transactions.forEach(t => {
                if (t.type === 'INGRESO') {
                    ingresos += t.amount;
                } else {
                    egresos += t.amount;
                }
            });

            return { ingresos, egresos, balance: ingresos - egresos };
        };

        const dailyBalance = calculateBalance(dailyTransactions);
        const monthlyBalance = calculateBalance(monthlyTransactions);
        const currentCash = calculateBalance(allTransactions);

        return NextResponse.json({
            daily: {
                ingresos: dailyBalance.ingresos,
                egresos: dailyBalance.egresos,
                balance: dailyBalance.balance
            },
            monthly: {
                ingresos: monthlyBalance.ingresos,
                egresos: monthlyBalance.egresos,
                balance: monthlyBalance.balance
            },
            currentCash: currentCash.balance,
            totalTransactions: allTransactions.length
        });
    }),

    // Delete transaction
    delete: apiHandler(async (req: Request) => {
        await connectDB();
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();

        if (!id) throw new AppError("ID requerido", 400);

        const transaction = await CashFlow.findByIdAndDelete(id);
        if (!transaction) throw new AppError("Transacción no encontrada", 404);

        return NextResponse.json({ message: "Transacción eliminada" });
    }),
};
