import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISaleProduct {
    product: mongoose.Types.ObjectId;
    name: string; // Snapshot of name
    quantity: number;
    price: number; // Snapshot of price at moment of sale
}

export interface ISaleService {
    service: mongoose.Types.ObjectId;
    name: string; // Snapshot of name
    quantity: number;
    price: number; // Snapshot of price at moment of sale
}

export interface ISale extends Document {
    products: ISaleProduct[];
    services: ISaleService[]; // NEW: Support for services
    total: number;
    paymentMethod: "Efectivo" | "Tarjeta" | "Transferencia" | "Otro";
    date: Date;
    client?: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId; // Admin/Vet who registered the sale
    createdAt: Date;
    updatedAt: Date;
}

const saleSchema = new Schema<ISale>(
    {
        products: [
            {
                product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
            },
        ],
        services: [
            {
                service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
            },
        ],
        total: { type: Number, required: true },
        paymentMethod: {
            type: String,
            enum: ["Efectivo", "Tarjeta", "Transferencia", "Otro"],
            required: true,
        },
        date: { type: Date, default: Date.now },
        client: { type: Schema.Types.ObjectId, ref: "User" },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export const Sale: Model<ISale> =
    mongoose.models.Sale || mongoose.model<ISale>("Sale", saleSchema);
