import mongoose, { Schema, Document, Model } from "mongoose";
import "./User"; // Registrar el modelo User

export interface IPet extends Document {
  nombre: string;
  especie: string;
  edad?: number; // Calculada desde fechaNacimiento, opcional
  raza: string;
  propietario: mongoose.Types.ObjectId;
  assignedVet?: mongoose.Types.ObjectId | null;

  // Nuevos campos
  peso?: number; // Peso en kg
  sexo?: 'macho' | 'hembra';
  fechaNacimiento?: Date;
  color?: string; // Color o marcas distintivas
  alergias?: string[]; // Lista de alergias conocidas
  esterilizado?: boolean;
  microchip?: string; // Número de microchip
  notasEspeciales?: string; // Comportamiento, dieta especial, etc.
  fotoUrl?: string; // URL de la foto

  createdAt: Date;
  updatedAt: Date;
}

const PetSchema = new Schema<IPet>(
  {
    nombre: { type: String, required: true },
    especie: { type: String, required: true }, // perro, gato, etc.
    edad: { type: Number, required: false }, // Opcional, puede calcularse
    raza: { type: String, required: true },

    // dueño de la mascota (cliente)
    propietario: { type: Schema.Types.ObjectId, ref: "User", required: true },

    // veterinario asignado
    assignedVet: { type: Schema.Types.ObjectId, ref: "User", required: false, default: null },

    // Nuevos campos
    peso: { type: Number, required: false },
    sexo: { type: String, enum: ['macho', 'hembra'], required: false },
    fechaNacimiento: { type: Date, required: false },
    color: { type: String, required: false },
    alergias: { type: [String], required: false, default: [] },
    esterilizado: { type: Boolean, required: false, default: false },
    microchip: { type: String, required: false },
    notasEspeciales: { type: String, required: false },
    fotoUrl: { type: String, required: false },
  },
  { timestamps: true }
);

// Método virtual para calcular edad desde fechaNacimiento
PetSchema.virtual('edadCalculada').get(function () {
  if (!this.fechaNacimiento) return this.edad;

  const today = new Date();
  const birthDate = new Date(this.fechaNacimiento);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
});

export const Pet: Model<IPet> = mongoose.models.Pet || mongoose.model<IPet>("Pet", PetSchema);
