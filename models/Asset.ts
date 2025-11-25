import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAsset extends Document {
    name: string;
    category: string;
    quantity: number;
    unitCost: number;
    initialValue: number; // Original total value (quantity * unitCost)
    totalValue: number; // Current value (depreciated if applicable)
    acquisitionDate: Date;
    isDepreciable: boolean;
    usefulLifeMonths?: number;
    createdAt: Date;
    updatedAt: Date;
}

const assetSchema = new Schema<IAsset>(
    {
        name: { type: String, required: true },
        category: { type: String, required: true }, // e.g., 'Equipamiento', 'Mobiliario', 'Insumos', 'Adecuaciones'
        quantity: { type: Number, required: true, default: 1 },
        unitCost: { type: Number, required: true },
        initialValue: { type: Number, required: true }, // quantity * unitCost at time of purchase
        totalValue: { type: Number, required: true }, // Current value, updated via depreciation
        acquisitionDate: { type: Date, required: true },
        isDepreciable: { type: Boolean, default: false },
        usefulLifeMonths: { type: Number }, // Required if isDepreciable is true
    },
    { timestamps: true }
);

export const Asset: Model<IAsset> =
    mongoose.models.Asset || mongoose.model<IAsset>("Asset", assetSchema);
