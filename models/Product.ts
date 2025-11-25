import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
    name: string;
    description?: string;
    category: string;
    quantity: number;
    unitCost: number;
    salePrice: number;
    minStock: number;
    provider?: string;
    expiryDate?: Date;
    location?: string;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        description: { type: String },
        category: { type: String, required: true },
        quantity: { type: Number, default: 0 },
        unitCost: { type: Number, required: true },
        salePrice: { type: Number, required: true },
        minStock: { type: Number, default: 5 },
        provider: { type: String },
        expiryDate: { type: Date },
        location: { type: String },
    },
    { timestamps: true }
);

export const Product: Model<IProduct> =
    mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);
