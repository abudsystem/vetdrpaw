import { Liability, ILiability } from "@/models/Liability";
import { apiHandler, AppError } from "@/lib/api-handler";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { z } from "zod";

// Schemas
const createLiabilitySchema = z.object({
    type: z.enum(['PRESTAMO', 'OBLIGACION']),
    description: z.string().min(1),
    amount: z.number().positive(),
    startDate: z.string().or(z.date()).transform((val) => new Date(val)),
    interestRate: z.number().min(0).default(0),
    termMonths: z.number().int().positive().default(1),
    amountPaid: z.number().min(0).default(0),
});

const updateLiabilitySchema = createLiabilitySchema.partial().extend({
    id: z.string(),
});

// Helper to calculate details
const calculateDetails = (liability: ILiability) => {
    // Simple interest calculation for the total term
    // Total Interest = Principal * (Monthly Rate / 100) * Months
    const totalInterest = liability.amount * (liability.interestRate / 100) * liability.termMonths;
    const totalDebt = liability.amount + totalInterest;
    const pendingAmount = Math.max(0, totalDebt - liability.amountPaid);
    const monthlyPayment = totalDebt / liability.termMonths;

    // Amortization (Principal part of the payment? Or just the schedule?)
    // Let's return the monthly payment value as "amortization" context for now, 
    // or we can generate a full table if needed. The prompt asked for "amortización" (singular).
    // Usually means the periodic payment.

    return {
        ...liability.toObject(),
        totalInterest,
        totalDebt,
        pendingAmount,
        monthlyPayment
    };
};

export const LiabilityController = {
    // List liabilities
    list: apiHandler(async (req: Request) => {
        await connectDB();
        const liabilities = await Liability.find({}).sort({ createdAt: -1 });

        const liabilitiesWithDetails = liabilities.map(l => calculateDetails(l));

        return NextResponse.json(liabilitiesWithDetails);
    }),

    // Create new liability
    create: apiHandler(async (req: Request) => {
        await connectDB();
        const body = await req.json();
        const data = createLiabilitySchema.parse(body);

        const liability = await Liability.create(data);
        return NextResponse.json(liability, { status: 201 });
    }),

    // Get by ID
    getById: apiHandler(async (req: Request) => {
        await connectDB();
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();

        if (!id) throw new AppError("ID requerido", 400);

        const liability = await Liability.findById(id);
        if (!liability) throw new AppError("Pasivo no encontrado", 404);

        return NextResponse.json(calculateDetails(liability));
    }),

    // Update liability
    update: apiHandler(async (req: Request) => {
        await connectDB();
        const body = await req.json();
        const { id, ...data } = updateLiabilitySchema.parse(body);

        const liability = await Liability.findByIdAndUpdate(id, data, { new: true });
        if (!liability) throw new AppError("Pasivo no encontrado", 404);

        return NextResponse.json(calculateDetails(liability));
    }),

    // Delete liability
    delete: apiHandler(async (req: Request) => {
        await connectDB();
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();

        if (!id) throw new AppError("ID requerido", 400);

        const liability = await Liability.findByIdAndDelete(id);
        if (!liability) throw new AppError("Pasivo no encontrado", 404);

        return NextResponse.json({ message: "Pasivo eliminado" });
    }),

    // Stats
    stats: apiHandler(async (req: Request) => {
        await connectDB();
        const liabilities = await Liability.find({});

        let totalDebt = 0;
        let totalPending = 0;
        let totalPaid = 0;

        liabilities.forEach(l => {
            const details = calculateDetails(l);
            totalDebt += details.totalDebt;
            totalPending += details.pendingAmount;
            totalPaid += l.amountPaid;
        });

        return NextResponse.json({
            totalDebt,
            totalPending,
            totalPaid,
            count: liabilities.length
        });
    }),
};
