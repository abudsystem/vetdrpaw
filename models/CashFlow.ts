import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICashFlow extends Document {
    date: Date;
    type: 'INGRESO' | 'EGRESO';
    category: 'VENTA' | 'SERVICIO' | 'GASTO' | 'PAGO_PASIVO' | 'COMPRA_INVENTARIO' | 'OTRO';
    description: string;
    amount: number;
    relatedDocument?: string; // Optional reference to sale/service ID
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

const cashFlowSchema = new Schema<ICashFlow>(
    {
        date: { type: Date, required: true, default: Date.now },
        type: {
            type: String,
            enum: ['INGRESO', 'EGRESO'],
            required: true
        },
        category: {
            type: String,
            enum: ['VENTA', 'SERVICIO', 'GASTO', 'PAGO_PASIVO', 'COMPRA_INVENTARIO', 'OTRO'],
            required: true
        },
        description: { type: String, required: true },
        amount: { type: Number, required: true },
        relatedDocument: { type: String },
        createdBy: { type: String, required: true },
    },
    { timestamps: true }
);

export const CashFlow: Model<ICashFlow> =
    mongoose.models.CashFlow || mongoose.model<ICashFlow>("CashFlow", cashFlowSchema);
