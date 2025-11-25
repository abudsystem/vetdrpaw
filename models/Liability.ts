import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILiability extends Document {
    type: 'PRESTAMO' | 'OBLIGACION';
    description: string;
    amount: number; // Principal amount
    startDate: Date;
    interestRate: number; // Monthly interest rate in %
    termMonths: number;
    amountPaid: number; // Amount already paid
    status: 'ACTIVO' | 'PAGADO';
    createdAt: Date;
    updatedAt: Date;
}

const liabilitySchema = new Schema<ILiability>(
    {
        type: {
            type: String,
            enum: ['PRESTAMO', 'OBLIGACION'],
            required: true
        },
        description: { type: String, required: true },
        amount: { type: Number, required: true },
        startDate: { type: Date, required: true },
        interestRate: { type: Number, required: true, default: 0 },
        termMonths: { type: Number, required: true, default: 1 },
        amountPaid: { type: Number, required: true, default: 0 },
        status: {
            type: String,
            enum: ['ACTIVO', 'PAGADO'],
            default: 'ACTIVO'
        },
    },
    { timestamps: true }
);

export const Liability: Model<ILiability> =
    mongoose.models.Liability || mongoose.model<ILiability>("Liability", liabilitySchema);
