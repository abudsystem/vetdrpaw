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
    pet?: mongoose.Types.ObjectId; // NEW: Linked pet
    appointment?: mongoose.Types.ObjectId; // NEW: Linked appointment
    user: mongoose.Types.ObjectId; // Admin/Vet who registered the sale
    subtotal: number; // NEW: Subtotal without IVA
    iva: number; // NEW: IVA amount
    invoiceNumber?: string; // NEW: Manual invoice number
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
        subtotal: { type: Number, required: true },
        iva: { type: Number, required: true },
        invoiceNumber: { type: String, required: false }, // Optional field for physical invoice linkage
        paymentMethod: {
            type: String,
            enum: ["Efectivo", "Tarjeta", "Transferencia", "Otro"],
            required: true,
        },
        date: { type: Date, default: Date.now },
        client: { type: Schema.Types.ObjectId, ref: "User" },
        pet: { type: Schema.Types.ObjectId, ref: "Pet" },
        appointment: { type: Schema.Types.ObjectId, ref: "Appointment" },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export const Sale: Model<ISale> =
    mongoose.models.Sale || mongoose.model<ISale>("Sale", saleSchema);
