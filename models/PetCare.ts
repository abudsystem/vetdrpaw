import mongoose, { Schema, Document } from "mongoose";

export interface IPetCare extends Document {
  title: { es: string; en: string };
  excerpt: { es: string; en: string };
  date: string;
  category: { es: string; en: string };
  link: string;
  createdAt: Date;
  updatedAt: Date;
}

const PetCareSchema: Schema = new Schema(
  {
    title: {
      es: { type: String, required: true },
      en: { type: String, required: true }
    },
    excerpt: {
      es: { type: String, required: true },
      en: { type: String, required: true }
    },
    date: { type: String, required: true },
    category: {
      es: { type: String, required: true },
      en: { type: String, required: true }
    },
    link: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const PetCare = mongoose.models.PetCare || mongoose.model<IPetCare>("PetCare", PetCareSchema);
