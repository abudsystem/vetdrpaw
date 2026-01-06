import mongoose, { Schema, Document, Model } from "mongoose";
import "./User";
import "./Pet";

export interface IAppointment extends Document {
  pet: mongoose.Types.ObjectId;
  veterinarian: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId; // Cliente que creó la cita
  date: Date;
  reason: string;
  status: "pendiente" | "aceptada" | "cancelada" | "completado";
  notas?: string; // Notas del veterinario después de la consulta
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
    veterinarian: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // Ahora opcional
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["pendiente", "aceptada", "cancelada", "completado"],
      default: "pendiente",
    },
    notas: { type: String, required: false },
  },
  { timestamps: true }
);

export const Appointment: Model<IAppointment> =
  mongoose.models.Appointment || mongoose.model<IAppointment>("Appointment", appointmentSchema);
