import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInventoryMovement extends Document {
    product: mongoose.Types.ObjectId;
    type: "ENTRADA" | "SALIDA" | "AJUSTE";
    quantity: number;
    reason?: string;
    date: Date;
    user: mongoose.Types.ObjectId; // Who made the movement
}

const inventoryMovementSchema = new Schema<IInventoryMovement>(
    {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        type: { type: String, enum: ["ENTRADA", "SALIDA", "AJUSTE"], required: true },
        quantity: { type: Number, required: true },
        reason: { type: String },
        date: { type: Date, default: Date.now },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    }
);

export const InventoryMovement: Model<IInventoryMovement> =
    mongoose.models.InventoryMovement ||
    mongoose.model<IInventoryMovement>("InventoryMovement", inventoryMovementSchema);
