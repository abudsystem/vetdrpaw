import mongoose, { Schema, Document, Model } from "mongoose";
import "./User";
import "./Pet";

export interface IVacuna {
    nombre: string;
    fecha: Date;
    proximaDosis?: Date;
    lote?: string;
    veterinario?: string;
}

export interface IMedicalRecord extends Document {
    pet: mongoose.Types.ObjectId;
    appointment?: mongoose.Types.ObjectId; // Opcional, puede no estar relacionado con una cita
    veterinarian: mongoose.Types.ObjectId;
    date: Date;
    motivo: string; // Razón de la visita
    diagnosis: string;
    treatment: string;
    receta?: string; // Medicamentos recetados
    notes?: string;
    proximaVisita?: Date; // Fecha sugerida para próxima visita
    vacunas?: IVacuna[]; // Vacunas aplicadas en esta visita
    peso?: number; // Peso registrado en la visita
    temperatura?: number; // Temperatura corporal
    createdAt: Date;
    updatedAt: Date;
}

const VacunaSchema = new Schema<IVacuna>({
    nombre: { type: String, required: true },
    fecha: { type: Date, required: true },
    proximaDosis: { type: Date, required: false },
    lote: { type: String, required: false },
    veterinario: { type: String, required: false },
}, { _id: false });

const MedicalRecordSchema: Schema = new Schema(
    {
        pet: { type: Schema.Types.ObjectId, ref: "Pet", required: true },
        appointment: { type: Schema.Types.ObjectId, ref: "Appointment", required: false },
        veterinarian: { type: Schema.Types.ObjectId, ref: "User", required: true },
        date: { type: Date, default: Date.now },
        motivo: { type: String, required: true },
        diagnosis: { type: String, required: true },
        treatment: { type: String, required: true },
        receta: { type: String, required: false },
        notes: { type: String },
        proximaVisita: { type: Date, required: false },
        vacunas: { type: [VacunaSchema], required: false, default: [] },
        peso: { type: Number, required: false },
        temperatura: { type: Number, required: false },
    },
    { timestamps: true }
);

// Índices para búsquedas eficientes
MedicalRecordSchema.index({ pet: 1, date: -1 });
MedicalRecordSchema.index({ veterinarian: 1 });

export const MedicalRecord: Model<IMedicalRecord> =
    mongoose.models.MedicalRecord || mongoose.model<IMedicalRecord>("MedicalRecord", MedicalRecordSchema);
