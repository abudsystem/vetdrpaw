import mongoose, { Schema, Document, Model } from "mongoose";

export interface IServiceSupply {
    product: mongoose.Types.ObjectId;
    quantity: number;
}

export interface IService extends Document {
    name: string;
    description?: string;
    basePrice: number;
    operatingCost: number;
    supplies: IServiceSupply[];
    duration: number; // in minutes
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
    {
        name: { type: String, required: true },
        description: { type: String },
        basePrice: { type: Number, required: true },
        operatingCost: { type: Number, default: 0 },
        supplies: [
            {
                product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
                quantity: { type: Number, required: true },
            },
        ],
        duration: { type: Number, default: 30 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const Service: Model<IService> =
    mongoose.models.Service || mongoose.model<IService>("Service", serviceSchema);
