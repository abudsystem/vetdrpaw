import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBackup extends Document {
    filename: string;
    type: 'MANUAL' | 'DAILY' | 'WEEKLY';
    createdBy: string; // User email or name
    recordCount: number;
    fileSize: number; // in bytes
    createdAt: Date;
}

const backupSchema = new Schema<IBackup>(
    {
        filename: { type: String, required: true },
        type: {
            type: String,
            enum: ['MANUAL', 'DAILY', 'WEEKLY'],
            required: true,
            default: 'MANUAL'
        },
        createdBy: { type: String, required: true },
        recordCount: { type: Number, required: true, default: 0 },
        fileSize: { type: Number, required: true, default: 0 },
    },
    { timestamps: true }
);

export const Backup: Model<IBackup> =
    mongoose.models.Backup || mongoose.model<IBackup>("Backup", backupSchema);
