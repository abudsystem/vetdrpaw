import mongoose, { Schema, Document } from "mongoose";

export interface IGalleryImage extends Document {
    title: string | { es: string; en: string };
    imageUrl: string; // Base64 string
    createdAt: Date;
}

const GalleryImageSchema = new Schema<IGalleryImage>(
    {
        title: {
            type: Schema.Types.Mixed,
            required: [true, "El título es obligatorio"],
        },
        imageUrl: {
            type: String,
            required: [true, "La imagen es obligatoria"],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent Mongoose overwrite warning in development
if (process.env.NODE_ENV !== 'production') delete mongoose.models.GalleryImage;

export default mongoose.models.GalleryImage ||
    mongoose.model<IGalleryImage>("GalleryImage", GalleryImageSchema);
